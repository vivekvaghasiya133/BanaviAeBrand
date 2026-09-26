import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
// The user should set this in their .env file. Fallback is provided to prevent crashes if not set.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/banaviaebrand';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error. Make sure your MONGODB_URI is correct in .env:', err.message));

// Define Mongoose Schemas
const workshopSchema = new mongoose.Schema({
  date: { type: String, required: true },
  location: { type: String, required: true },
  maxSlots: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  city: { type: String, default: '' },
  instagramHandle: { type: String, default: '' },
  profession: { type: String, default: 'General' },
  whyJoin: { type: String, default: '' },
  interestArea: { type: String, default: 'General' },
  socialExperience: { type: String, default: 'Beginner' },
  editingExperience: { type: String, default: 'No' },
  participationAgreement: { type: Boolean, default: true },
  source: { type: String, default: 'Direct' },
  workshopId: { type: String, default: '' },
  workshopDate: { type: String, default: '' },
  // CRM Follow-up Management Fields
  followUpHistory: [{
    outcome: String,
    callerName: String,
    nextFollowUpDate: String,
    note: String,
    createdAt: { type: Date, default: Date.now }
  }],
  latestOutcome: { type: String, default: 'Pending' },
  latestNextFollowUpDate: { type: String, default: '' },
  latestCallerName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Workshop = mongoose.model('Workshop', workshopSchema);
const Registration = mongoose.model('Registration', registrationSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all workshops with their current booking status
app.get('/api/workshops', async (req, res) => {
  try {
    const workshops = await Workshop.find().lean();
    
    // For each workshop, count registrations
    const enrichedWorkshops = await Promise.all(workshops.map(async (ws) => {
      const booked = await Registration.countDocuments({ 
        $or: [
          { workshopId: ws._id },
          { workshopDate: ws.date } // backward compatibility for old data if migrated
        ]
      });
      return {
        id: ws._id.toString(),
        date: ws.date,
        location: ws.location,
        maxSlots: ws.maxSlots,
        slotsBooked: booked,
        slotsLeft: Math.max(0, ws.maxSlots - booked),
        isFull: booked >= ws.maxSlots
      };
    }));
    
    res.json({ success: true, data: enrichedWorkshops });
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Create workshop
app.post('/api/admin/workshops', async (req, res) => {
  try {
    const { date, location, maxSlots } = req.body;
    if (!date || !location || !maxSlots) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    const newWs = new Workshop({
      date,
      location,
      maxSlots: parseInt(maxSlots, 10)
    });
    
    await newWs.save();
    
    res.json({ 
      success: true, 
      data: {
        id: newWs._id.toString(),
        date: newWs.date,
        location: newWs.location,
        maxSlots: newWs.maxSlots
      }
    });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Delete workshop
app.delete('/api/admin/workshops/:id', async (req, res) => {
  try {
    const result = await Workshop.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Workshop not found' });
    }
  } catch (error) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { 
      name, email, phone, city, instagramHandle, profession,
      whyJoin, interestArea, socialExperience, editingExperience,
      participationAgreement, source, workshopId
    } = req.body;

    if (!name || !email || !phone || !city || !profession || !whyJoin || !interestArea || !socialExperience || !editingExperience || !participationAgreement || !source || !workshopId) {
      return res.status(400).json({ success: false, error: 'All required fields must be filled.' });
    }

    // Validate MongoDB ObjectId format before querying to prevent CastError crashes
    if (!mongoose.Types.ObjectId.isValid(workshopId)) {
      return res.status(400).json({ success: false, error: 'Invalid workshop ID format.' });
    }

    const targetWorkshop = await Workshop.findById(workshopId);
    
    if (!targetWorkshop) {
      return res.status(400).json({ success: false, error: 'Invalid workshop selected.' });
    }

    const bookedForWorkshop = await Registration.countDocuments({ workshopId });
    
    if (bookedForWorkshop >= targetWorkshop.maxSlots) {
      return res.status(400).json({ success: false, error: 'Sorry, this workshop is full.' });
    }

    const newReg = new Registration({
      name, email, phone, city,
      instagramHandle: instagramHandle || '',
      profession, whyJoin, interestArea, socialExperience,
      editingExperience, participationAgreement, source,
      workshopId,
      workshopDate: targetWorkshop.date
    });

    await newReg.save();

    console.log('🎉 New Registration:', newReg.name, 'for', targetWorkshop.date);

    // Send WhatsApp Thank You message via Wababa API
    try {
      // Clean phone number (remove +, spaces, dashes)
      let cleanPhone = phone.replace(/[\+\s\-]/g, '');
      // Ensure it starts with 91 if it's a 10 digit Indian number
      if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }

      await fetch('https://wababa.in/api/public/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer wac_fe2814afc40ca8e732ccb2217e5da792386fc4e02b2ffaad',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: cleanPhone,
          type: 'template',
          templateName: 'welcome',
          language: 'gu',
          variables: [name] // Pass the lead's name as the variable
        })
      });
      console.log('✅ WhatsApp Welcome message sent to:', cleanPhone);
    } catch (whatsappErr) {
      console.error('❌ Failed to send WhatsApp message:', whatsappErr);
      // We don't want to fail the registration if WhatsApp fails, so just log it
    }

    res.json({ 
      success: true, 
      data: {
        id: newReg._id.toString(),
        ...newReg.toObject()
      } 
    });
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin Routes for Registrations
app.get('/api/admin/registrations', async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 }).lean();
    
    const formattedRegs = regs.map(r => ({
      ...r,
      id: r._id.toString()
    }));
    
    res.json({ success: true, data: formattedRegs });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Add a Manual Lead
app.post('/api/admin/registrations', async (req, res) => {
  try {
    const { 
      name, phone, email, city, instagramHandle, profession,
      interestArea, source, outcome, callerName, nextFollowUpDate, note,
      workshopDate
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone number are required.' });
    }

    const followUpHistory = [];
    if (outcome || note || nextFollowUpDate) {
      followUpHistory.push({
        outcome: outcome || 'Call Again',
        callerName: callerName || 'Admin',
        nextFollowUpDate: nextFollowUpDate || '',
        note: note || 'Lead created manually',
        createdAt: new Date()
      });
    }

    const newReg = new Registration({
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      city: (city || '').trim(),
      instagramHandle: (instagramHandle || '').trim(),
      profession: (profession || 'Business / Creator').trim(),
      whyJoin: req.body.whyJoin || 'Manual lead entry',
      interestArea: interestArea || 'General',
      socialExperience: req.body.socialExperience || 'Beginner',
      editingExperience: req.body.editingExperience || 'No',
      participationAgreement: true,
      source: (source || 'Manual Entry').trim(),
      workshopDate: (workshopDate || '').trim(),
      followUpHistory,
      latestOutcome: outcome || 'Call Again',
      latestNextFollowUpDate: nextFollowUpDate || '',
      latestCallerName: (callerName || 'Admin').trim(),
      createdAt: new Date()
    });

    await newReg.save();
    console.log('✅ Manual Lead Created:', newReg.name, newReg.phone);

    res.json({
      success: true,
      data: {
        ...newReg.toObject(),
        id: newReg._id.toString()
      }
    });
  } catch (error) {
    console.error('Error creating manual lead:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error creating manual lead' });
  }
});

app.delete('/api/admin/registrations/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const result = await Registration.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Registration not found' });
    }
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Add a Follow-up record
app.post('/api/admin/registrations/:id/followups', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const { outcome, callerName, nextFollowUpDate, note } = req.body;
    
    const newFollowUp = {
      outcome,
      callerName,
      nextFollowUpDate,
      note,
      createdAt: new Date()
    };
    
    const updatedReg = await Registration.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { followUpHistory: newFollowUp },
        $set: { 
          latestOutcome: outcome,
          latestNextFollowUpDate: nextFollowUpDate,
          latestCallerName: callerName
        }
      },
      { new: true } // Return updated document
    );

    if (updatedReg) {
      res.json({ success: true, data: { ...updatedReg.toObject(), id: updatedReg._id.toString() } });
    } else {
      res.status(404).json({ success: false, error: 'Registration not found' });
    }
  } catch (error) {
    console.error('Error adding follow-up:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Serve static client assets if built
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Banaviae Brand API Server running on http://localhost:${PORT}`);
});
