'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ContactsPage() {
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [contacts, setContacts] = useState([
    { name: 'Ayesha (Sister)', phone: '+923001234567' },
    { name: 'Ali (Brother)', phone: '+923009876543' }
  ]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    setContacts([...contacts, { name: newName, phone: newPhone }]);
    setNewName('');
    setNewPhone('');
  };

  const handleDelete = (index: number) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Navbar lang={lang} setLang={setLang} />

      <main className="max-w-2xl mx-auto py-10 px-4 space-y-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-rose-600 mb-2">👥 Trusted Emergency Contacts</h1>
          <p className="text-slate-500 text-sm mb-6">
            Add people who will be immediately notified during an emergency alert.
          </p>

          {/* Add Contact Form */}
          <form onSubmit={handleAddContact} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Father / Best Friend"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. +923XXXXXXXXX"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Add Trusted Contact
            </button>
          </form>

          {/* Contact List */}
          <h2 className="text-lg font-bold mb-4">Saved Contacts ({contacts.length})</h2>
          <div className="space-y-3">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                <div>
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-xs text-slate-500">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/30"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}