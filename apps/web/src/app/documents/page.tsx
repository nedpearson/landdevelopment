'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Trash2, FileText, X, Check, File, FileImage } from 'lucide-react';

const MOCK_DOCUMENTS = [
  { id: '1', fileName: 'Warranty_Deed_Smith_Tract.pdf', property: 'Smith Tract - 40 Acres', type: 'Deed', uploadedBy: 'Ned Pearson', uploadDate: '2023-10-15', size: '2.4 MB', tags: ['Signed', 'Official'] },
  { id: '2', fileName: 'Phase_1_ESA_Riverside.pdf', property: 'Riverside Development', type: 'Report', uploadedBy: 'Sarah Jenkins', uploadDate: '2023-10-20', size: '15.1 MB', tags: ['Environmental', 'Pending Review'] },
  { id: '3', fileName: 'Boundary_Survey_Final.dwg', property: 'Oak Hill Parcels', type: 'Survey', uploadedBy: 'Mike Surveyor', uploadDate: '2023-10-22', size: '8.7 MB', tags: ['Final'] },
  { id: '4', fileName: 'Purchase_Contract_Draft_v2.docx', property: 'Pine Valley 100', type: 'Contract', uploadedBy: 'Ned Pearson', uploadDate: '2023-10-25', size: '1.1 MB', tags: ['Draft', 'Legal'] },
  { id: '5', fileName: 'Site_Photos_Oct.zip', property: 'Riverside Development', type: 'Photo', uploadedBy: 'John Doe', uploadDate: '2023-10-26', size: '45.2 MB', tags: ['Drone', 'Site Visit'] },
  { id: '6', fileName: 'Grazing_Lease_2024.pdf', property: 'Smith Tract - 40 Acres', type: 'Lease', uploadedBy: 'Sarah Jenkins', uploadDate: '2023-10-28', size: '1.5 MB', tags: ['Active'] },
];

export default function DocumentManager() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    showToast('Document deleted', 'success');
  };

  const handleDownload = (fileName: string) => {
    showToast(`Downloading ${fileName}...`, 'success');
  };

  const filteredDocs = documents.filter(d => 
    d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white z-50 flex items-center`}>
          <Check className="w-5 h-5 mr-2" />
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Document Manager</h1>
          <p className="text-slate-400">Manage and organize files across all properties</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents by name or property..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md flex items-center transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">File Name</th>
              <th className="p-4 font-medium">Property/Project</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Uploaded By</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Size</th>
              <th className="p-4 font-medium">Tags</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map(doc => (
              <tr key={doc.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group">
                <td className="p-4 flex items-center">
                  {doc.type === 'Photo' ? <FileImage className="w-5 h-5 mr-3 text-emerald-400" /> : <FileText className="w-5 h-5 mr-3 text-sky-400" />}
                  <span className="font-medium text-white">{doc.fileName}</span>
                </td>
                <td className="p-4">{doc.property}</td>
                <td className="p-4">
                  <span className="bg-slate-700 px-2 py-1 rounded text-xs">{doc.type}</span>
                </td>
                <td className="p-4 text-sm">{doc.uploadedBy}</td>
                <td className="p-4 text-sm">{doc.uploadDate}</td>
                <td className="p-4 text-sm text-slate-400">{doc.size}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map(tag => (
                      <span key={tag} className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDownload(doc.fileName)} className="p-1.5 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-700 hover:bg-slate-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  No documents found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Upload Document</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => showToast('Simulating file select', 'success')}>
                <File className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300">Click to select file or drag and drop</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Document Type</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500">
                  <option>Deed</option>
                  <option>Lease</option>
                  <option>Survey</option>
                  <option>Report</option>
                  <option>Contract</option>
                  <option>Photo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Draft, Environmental" />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  showToast('Document uploaded successfully');
                  setIsUploadModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
