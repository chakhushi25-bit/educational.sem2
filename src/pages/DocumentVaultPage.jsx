import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function DocumentVaultPage({ user, documents = [], onDocumentUploaded, onDocumentDeleted, onOpenAiWithSubject, onGeneratePlanFromDoc }) {
  const [docList, setDocList] = useState(documents);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Upload Form State
  const [uploadFile, setUploadFile] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [targetSubjectId, setTargetSubjectId] = useState(user?.subjects?.[0]?.id || 'bio');

  useEffect(() => {
    setDocList(documents);
  }, [documents]);

  const loadDocuments = async () => {
    try {
      const data = await api.getDocuments();
      setDocList(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const subjects = user?.subjects || [
    { id: 'bio', name: 'General Biology' },
    { id: 'econ', name: 'Macroeconomics' },
    { id: 'pol_sci', name: 'Political Science' },
    { id: 'math', name: 'Calculus & Linear Algebra' },
  ];

  const filteredDocs = selectedSubject === 'all'
    ? docList
    : docList.filter(d => d.subjectId === selectedSubject);

  const totalChunks = docList.reduce((acc, d) => acc + (d.chunkCount || 0), 0);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!customTitle) {
        setCustomTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);
    setUploadProgress(20);

    const subjectObj = subjects.find(s => s.id === targetSubjectId) || { name: 'General Subject' };
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('subjectId', targetSubjectId);
    formData.append('subjectName', subjectObj.name);
    formData.append('title', customTitle);

    try {
      setUploadProgress(60);
      const res = await api.uploadDocument(formData);
      setUploadProgress(100);
      setUploadSuccess(`Indexed "${res.document.title}" with ${res.chunks_indexed} semantic knowledge chunks!`);
      setUploadFile(null);
      setCustomTitle('');
      if (onDocumentUploaded) onDocumentUploaded(res.document);
      loadDocuments();
    } catch (err) {
      setUploadError(err.message || 'Upload and indexing failed.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document from the RAG knowledge vault?')) return;
    try {
      await api.deleteDocument(docId);
      setDocList(prev => prev.filter(d => d.id !== docId));
      if (onDocumentDeleted) onDocumentDeleted(docId);
    } catch (err) {
      alert(err.message || 'Failed to delete document.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-container to-secondary p-8 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>RAG Subject Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-headline-sm tracking-tight leading-tight">
            Subject Content & Document Vault
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            Upload course syllabi, lecture slides, and PDF notes. StudySync chunks and indexes your materials so the AI Tutor can ground answers and generate custom study roadmaps directly from your actual curriculum.
          </p>
        </div>

        {/* Stats overlay */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-headline-sm">{docList.length}</div>
            <div className="text-xs text-white/80 font-medium">Uploaded Documents</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-headline-sm">{totalChunks}</div>
            <div className="text-xs text-white/80 font-medium">Indexed Knowledge Chunks</div>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-white/95">RAG Grounding Engine Active</span>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
      </div>

      {/* Upload Zone & Form */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">upload_file</span>
            </div>
            <div>
              <h2 className="text-lg font-bold font-headline-sm text-on-surface">
                Upload New Subject Material
              </h2>
              <p className="text-xs text-on-surface-variant">
                Supports PDF, DOCX, TXT, and Markdown files up to 15MB.
              </p>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{uploadSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Target Subject *
              </label>
              <select
                value={targetSubjectId}
                onChange={(e) => setTargetSubjectId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-xs sm:text-sm text-on-surface focus:border-primary outline-none transition-all"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code || s.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Document Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Chapter 4 Cellular Metabolism"
                className="w-full px-3.5 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-xs sm:text-sm text-on-surface focus:border-primary outline-none transition-all"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Select File (.pdf, .txt, .md) *
              </label>
              <input
                type="file"
                accept=".pdf,.txt,.md,.docx,.json,.csv"
                onChange={handleFileChange}
                className="w-full text-xs text-on-surface file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-outline-variant/40 rounded-2xl p-1.5 bg-surface-container"
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isUploading || !uploadFile}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Extracting & Chunking Knowledge...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Upload & Index with RAG</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
            selectedSubject === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          All Subjects ({docList.length})
        </button>
        {subjects.map((subj) => {
          const count = docList.filter(d => d.subjectId === subj.id).length;
          return (
            <button
              key={subj.id}
              onClick={() => setSelectedSubject(subj.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedSubject === subj.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span>{subj.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedSubject === subj.id ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-surface rounded-3xl p-6 border border-outline-variant/30 hover:border-primary/40 transition-all hover:shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">description</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wide">
                  {doc.subjectName || 'Course Note'}
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface font-headline-sm line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
                {doc.title}
              </h3>

              <p className="text-xs text-on-surface-variant line-clamp-3 mb-4 leading-relaxed">
                {doc.summary || 'Indexed knowledge material ready for AI tutor query and timetable mapping.'}
              </p>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-outline">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">layers</span>
                  <span>{doc.chunkCount || 1} chunks</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  <span>{doc.uploadedAt || 'Recently'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAiWithSubject && onOpenAiWithSubject(doc.subjectId)}
                  className="flex-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-primary flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  <span>Ask AI Tutor</span>
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="w-8 h-8 rounded-xl bg-surface-container hover:bg-error/10 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
                  title="Delete Document"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-16 text-center bg-surface rounded-3xl border border-dashed border-outline-variant/40 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[28px]">folder_open</span>
            </div>
            <h4 className="text-base font-bold text-on-surface">No documents found for this subject</h4>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              Upload course PDFs or notes above to build your subject's semantic knowledge base.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
