import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory store (Since this is a quick launch, we can use an array or a JSON file)
const dataDir = path.join(__dirname, 'data');
const regDbPath = path.join(dataDir, 'registrations.json');
const workshopDbPath = path.join(dataDir, 'workshops.json');

// Ensure data dir exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(regDbPath)) {
  fs.writeFileSync(regDbPath, JSON.stringify([]));
}
if (!fs.existsSync(workshopDbPath)) {
  // Seed with default workshops
  const defaultWorkshops = [
    { id: 'ws_1', date: '4th October 2026', location: 'Surat, Gujarat', maxSlots: 30, createdAt: new Date().toISOString() },
    { id: 'ws_2', date: '10th October 2026', location: 'Ahmedabad, Gujarat', maxSlots: 30, createdAt: new Date().toISOString() }
  ];
  fs.writeFileSync(workshopDbPath, JSON.stringify(defaultWorkshops, null, 2));
}

function getRegistrations() {
  try {
    return JSON.parse(fs.readFileSync(regDbPath, 'utf8'));
  } catch (err) {
    console.error('Error reading regs:', err);
    return [];
  }
}

function saveRegistrations(data) {
  try {
    fs.writeFileSync(regDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing regs:', err);
  }
}

function getWorkshops() {
  try {
    return JSON.parse(fs.readFileSync(workshopDbPath, 'utf8'));
  } catch (err) {
    console.error('Error reading workshops:', err);
    return [];
  }
}

function saveWorkshops(data) {
  try {
    fs.writeFileSync(workshopDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing workshops:', err);
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all workshops with their current booking status
app.get('/api/workshops', (req, res) => {
  const workshops = getWorkshops();
  const regs = getRegistrations();
  
  const enrichedWorkshops = workshops.map(ws => {
    // Count how many registrations are for this workshopId
    // (Fallback to matching by date for old data compatibility)
    const booked = regs.filter(r => r.workshopId === ws.id || r.workshopDate === ws.date).length;
    return {
      ...ws,
      slotsBooked: booked,
      slotsLeft: Math.max(0, ws.maxSlots - booked),
      isFull: booked >= ws.maxSlots
    };
  });
  
  res.json({ success: true, data: enrichedWorkshops });
});

// Admin: Create workshop
app.post('/api/admin/workshops', (req, res) => {
  const { date, location, maxSlots } = req.body;
  if (!date || !location || !maxSlots) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  const workshops = getWorkshops();
  const newWs = {
    id: `ws_${Date.now()}`,
    date,
    location,
    maxSlots: parseInt(maxSlots, 10),
    createdAt: new Date().toISOString()
  };
  
  workshops.push(newWs);
  saveWorkshops(workshops);
  res.json({ success: true, data: newWs });
});

// Admin: Delete workshop
app.delete('/api/admin/workshops/:id', (req, res) => {
  const workshops = getWorkshops();
  const updated = workshops.filter(w => w.id !== req.params.id);
  if (updated.length !== workshops.length) {
    saveWorkshops(updated);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Workshop not found' });
  }
});

// Register a new user
app.post('/api/register', (req, res) => {
  const { 
    name, 
    email, 
    phone, 
    city,
    instagramHandle, 
    profession,
    whyJoin,
    interestArea,
    socialExperience,
    editingExperience,
    participationAgreement,
    source,
    workshopId
  } = req.body;

  if (!name || !email || !phone || !city || !profession || !whyJoin || !interestArea || !socialExperience || !editingExperience || !participationAgreement || !source || !workshopId) {
    return res.status(400).json({ success: false, error: 'All required fields must be filled.' });
  }

  const workshops = getWorkshops();
  const targetWorkshop = workshops.find(w => w.id === workshopId);
  
  if (!targetWorkshop) {
    return res.status(400).json({ success: false, error: 'Invalid workshop selected.' });
  }

  const regs = getRegistrations();
  const bookedForWorkshop = regs.filter(r => r.workshopId === workshopId).length;
  
  if (bookedForWorkshop >= targetWorkshop.maxSlots) {
    return res.status(400).json({ success: false, error: 'Sorry, this workshop is full.' });
  }

  const newReg = {
    id: `reg_${Date.now()}`,
    name,
    email,
    phone,
    city,
    instagramHandle: instagramHandle || '',
    profession,
    whyJoin,
    interestArea,
    socialExperience,
    editingExperience,
    participationAgreement,
    source,
    workshopId,
    workshopDate: targetWorkshop.date, // Store for easy reference
    createdAt: new Date().toISOString()
  };

  regs.push(newReg);
  saveRegistrations(regs);

  console.log('🎉 New Registration:', newReg.name, 'for', targetWorkshop.date);

  res.json({ success: true, data: newReg });
});

// Admin Routes for Registrations
app.get('/api/admin/registrations', (req, res) => {
  const regs = getRegistrations();
  res.json({ success: true, data: regs.reverse() }); // Newest first
});

app.delete('/api/admin/registrations/:id', (req, res) => {
  const regs = getRegistrations();
  const updatedRegs = regs.filter(r => r.id !== req.params.id);
  
  if (regs.length !== updatedRegs.length) {
    saveRegistrations(updatedRegs);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Registration not found' });
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
