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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
  // Lead Categories: 'original' | 'coldcall' | 'confirmed'
  leadType: { type: String, enum: ['original', 'coldcall', 'confirmed'], default: 'original', index: true },
  tag: { type: String, default: '', index: true },
  confirmedAt: { type: Date },
  confirmedCourse: { type: String, default: '' },
  confirmedNote: { type: String, default: '' },
  assignedAdmin: { type: String, default: '', index: true },
  // CRM Follow-up Management Fields
  followUpHistory: [{
    outcome: String,
    callerName: String,
    assignedAdmin: String,
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
    const { leadType, tag, search, assignedAdmin } = req.query;
    let query = {};

    if (leadType === 'original') {
      query.$or = [{ leadType: 'original' }, { leadType: { $exists: false } }, { leadType: null }];
      query.latestOutcome = { $ne: 'Admin Call' };
    } else if (leadType === 'coldcall') {
      query.leadType = 'coldcall';
      query.latestOutcome = { $ne: 'Admin Call' };
    } else if (leadType === 'confirmed') {
      query.leadType = 'confirmed';
    } else if (leadType === 'admincall') {
      query.latestOutcome = 'Admin Call';
      if (assignedAdmin && assignedAdmin !== 'All') {
        query.assignedAdmin = assignedAdmin;
      }
    }

    if (tag && tag !== 'All') {
      query.tag = tag;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: searchRegex },
          { phone: searchRegex },
          { email: searchRegex },
          { tag: searchRegex },
          { city: searchRegex },
          { assignedAdmin: searchRegex },
          { latestCallerName: searchRegex }
        ]
      });
    }

    const regs = await Registration.find(query).sort({ createdAt: -1 }).lean();
    
    const formattedRegs = regs.map(r => ({
      ...r,
      id: r._id.toString(),
      leadType: r.leadType || 'original',
      tag: r.tag || '',
      assignedAdmin: r.assignedAdmin || ''
    }));
    
    res.json({ success: true, data: formattedRegs });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Get Lead Counts and Distinct Tags
app.get('/api/admin/lead-counts', async (req, res) => {
  try {
    const [original, coldcall, confirmed, admincall, total] = await Promise.all([
      Registration.countDocuments({
        $or: [{ leadType: 'original' }, { leadType: { $exists: false } }, { leadType: null }],
        latestOutcome: { $ne: 'Admin Call' }
      }),
      Registration.countDocuments({ leadType: 'coldcall', latestOutcome: { $ne: 'Admin Call' } }),
      Registration.countDocuments({ leadType: 'confirmed' }),
      Registration.countDocuments({ latestOutcome: 'Admin Call' }),
      Registration.countDocuments({})
    ]);

    const adminBreakdown = {
      Manthan: await Registration.countDocuments({ latestOutcome: 'Admin Call', assignedAdmin: 'Manthan' }),
      Vivek: await Registration.countDocuments({ latestOutcome: 'Admin Call', assignedAdmin: 'Vivek' }),
      Jaydeep: await Registration.countDocuments({ latestOutcome: 'Admin Call', assignedAdmin: 'Jaydeep' }),
      Kuldeep: await Registration.countDocuments({ latestOutcome: 'Admin Call', assignedAdmin: 'Kuldeep' }),
    };

    const distinctTags = await Registration.distinct('tag', { leadType: 'coldcall', tag: { $ne: '' } });

    res.json({
      success: true,
      counts: { original, coldcall, confirmed, admincall, total },
      adminBreakdown,
      tags: distinctTags.filter(Boolean)
    });
  } catch (error) {
    console.error('Error fetching lead counts:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Bulk Import Leads (6000+ support with batching)
app.post('/api/admin/registrations/bulk-import', async (req, res) => {
  try {
    const { leads, leadType = 'coldcall', defaultTag = '', callerName = 'Admin' } = req.body;
    
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ success: false, error: 'Leads array is required and must not be empty.' });
    }

    console.log(`📥 Starting bulk import of ${leads.length} leads (type: ${leadType})...`);

    const documents = [];
    const now = new Date();

    for (let i = 0; i < leads.length; i++) {
      const item = leads[i];
      if (!item) continue;

      const rawPhone = String(item.phone || item.number || item.mobile || '').trim();
      const cleanPhone = rawPhone.replace(/[\s\-\(\)\.]/g, '');
      
      if (!cleanPhone) continue; // skip entries without phone number

      const name = String(item.name || 'Prospect').trim();
      const tag = String(item.tag || item.category || defaultTag || '').trim();
      const city = String(item.city || '').trim();
      const email = String(item.email || '').trim();

      documents.push({
        name,
        phone: cleanPhone,
        email,
        city,
        tag,
        leadType: leadType || 'coldcall',
        source: item.source || 'Cold Call Import',
        profession: item.profession || tag || 'General',
        interestArea: tag || 'General',
        latestOutcome: item.outcome || 'Pending',
        latestCallerName: callerName || '',
        followUpHistory: [],
        createdAt: now
      });
    }

    if (documents.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid leads with phone numbers found in import data.' });
    }

    // Insert in batches of 1000 for high efficiency and safety
    const BATCH_SIZE = 1000;
    let insertedCount = 0;

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      const result = await Registration.insertMany(batch, { ordered: false });
      insertedCount += result.length;
    }

    console.log(`✅ Bulk import completed: ${insertedCount} leads inserted successfully!`);

    res.json({
      success: true,
      count: insertedCount,
      totalReceived: leads.length,
      message: `Successfully imported ${insertedCount} leads.`
    });
  } catch (error) {
    console.error('Error in bulk import:', error);
    if (error.insertedDocs || error.result?.nInserted) {
      const count = error.insertedDocs?.length || error.result?.nInserted || 0;
      return res.json({
        success: true,
        count,
        warning: 'Bulk import partially completed with some skipped duplicates or invalid entries.'
      });
    }
    res.status(500).json({ success: false, error: error.message || 'Server error during bulk import' });
  }
});

// Admin: Move Lead to another category (e.g. Cold Call -> Original Leads)
app.patch('/api/admin/registrations/:id/move', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const { targetType, callerName, note } = req.body;
    if (!targetType || !['original', 'coldcall', 'confirmed'].includes(targetType)) {
      return res.status(400).json({ success: false, error: 'Invalid target type' });
    }

    const lead = await Registration.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const oldType = lead.leadType || 'original';
    lead.leadType = targetType;

    const moveNote = note || `Moved from ${oldType.toUpperCase()} to ${targetType.toUpperCase()}`;
    lead.followUpHistory.push({
      outcome: `Moved to ${targetType.charAt(0).toUpperCase() + targetType.slice(1)}`,
      callerName: callerName || 'Admin',
      nextFollowUpDate: lead.latestNextFollowUpDate || '',
      note: moveNote,
      createdAt: new Date()
    });

    if (callerName) lead.latestCallerName = callerName;

    await lead.save();

    res.json({
      success: true,
      data: { ...lead.toObject(), id: lead._id.toString() },
      message: `Lead successfully moved to ${targetType}`
    });
  } catch (error) {
    console.error('Error moving lead:', error);
    res.status(500).json({ success: false, error: 'Server error moving lead' });
  }
});

// Admin: Confirm Lead for Course / Workshop
app.patch('/api/admin/registrations/:id/confirm', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const { confirmedCourse, confirmedNote, callerName } = req.body;

    const lead = await Registration.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    lead.leadType = 'confirmed';
    lead.latestOutcome = 'Client Done';
    lead.confirmedAt = new Date();
    lead.confirmedCourse = confirmedCourse || lead.workshopDate || 'Workshop';
    lead.confirmedNote = confirmedNote || '';
    if (callerName) lead.latestCallerName = callerName;

    const noteText = `Confirmed for ${lead.confirmedCourse}${confirmedNote ? ' | ' + confirmedNote : ''}`;
    lead.followUpHistory.push({
      outcome: 'Client Done',
      callerName: callerName || 'Admin',
      nextFollowUpDate: '',
      note: noteText,
      createdAt: new Date()
    });

    await lead.save();

    res.json({
      success: true,
      data: { ...lead.toObject(), id: lead._id.toString() },
      message: 'Lead confirmed for course successfully!'
    });
  } catch (error) {
    console.error('Error confirming lead:', error);
    res.status(500).json({ success: false, error: 'Server error confirming lead' });
  }
});

// Admin: Revert Confirmation back to original or coldcall
app.patch('/api/admin/registrations/:id/revert-confirm', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const { targetType = 'original', callerName, note } = req.body;

    const lead = await Registration.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    lead.leadType = targetType;
    lead.latestOutcome = 'Call Again';
    lead.followUpHistory.push({
      outcome: 'Reverted Confirmation',
      callerName: callerName || 'Admin',
      note: note || 'Confirmation cancelled / reverted',
      createdAt: new Date()
    });

    await lead.save();

    res.json({
      success: true,
      data: { ...lead.toObject(), id: lead._id.toString() },
      message: 'Confirmation reverted successfully'
    });
  } catch (error) {
    console.error('Error reverting confirmation:', error);
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
      leadType: req.body.leadType || 'original',
      tag: (req.body.tag || '').trim(),
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

    const { outcome, callerName, nextFollowUpDate, note, assignedAdmin } = req.body;
    
    const newFollowUp = {
      outcome,
      callerName,
      assignedAdmin: assignedAdmin || '',
      nextFollowUpDate,
      note,
      createdAt: new Date()
    };
    
    const updateFields = {
      latestOutcome: outcome,
      latestNextFollowUpDate: nextFollowUpDate,
      latestCallerName: callerName
    };

    if (assignedAdmin !== undefined) {
      updateFields.assignedAdmin = assignedAdmin;
    }

    const updatedReg = await Registration.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { followUpHistory: newFollowUp },
        $set: updateFields
      },
      { returnDocument: 'after' }
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
