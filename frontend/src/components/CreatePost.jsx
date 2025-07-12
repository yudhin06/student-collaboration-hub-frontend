import React, { useState } from 'react';
import { postAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const categories = [
  'AI-ML', 'Programming', 'Telecommunications', 'Study Tips', 'Career', 'Other'
];

const postTypes = [
  { value: 'note', label: 'Note' },
  { value: 'job', label: 'Job' },
  { value: 'thread', label: 'Thread' }
];

const CreatePost = ({ onSubmit, onCancel, label = "Post" }) => {
  const { user } = useAuth();
  const [type, setType] = useState('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [animateClose, setAnimateClose] = useState(false);
  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [jobLink, setJobLink] = useState('');
  const [referralInfo, setReferralInfo] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
    setDocumentName(file ? file.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || (type !== 'job' && !content) || (type === 'job' && !jobLink)) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setUploadingDoc(!!document);
    try {
      let imageUrl = '';
      if (image) {
        const imgRes = await postAPI.uploadImage(image);
        if (!imgRes.url) throw new Error('Image upload failed');
        imageUrl = imgRes.url;
      }
      let documentUrl = '';
      if (document && type === 'note') {
        const docRes = await postAPI.uploadImage(document);
        if (!docRes.url) throw new Error('Document upload failed');
        documentUrl = docRes.url;
      }
      setUploadingDoc(false);
      // Compose post data for backend
      const postData = {
        type,
        title,
        excerpt: content.slice(0, 100),
        author: user?.name || 'Anonymous',
        category,
        read_time: `${Math.max(1, Math.ceil(content.length / 300))} min read`,
        image: imageUrl || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        content: type !== 'job' ? content : undefined,
        document_url: type === 'note' ? (documentUrl || undefined) : undefined,
        job_link: type === 'job' ? jobLink : undefined,
        referral_info: type === 'job' ? referralInfo : undefined,
      };
      await onSubmit(postData);
      setSuccess(true);
      setTimeout(() => {
        setAnimateClose(true);
        setTimeout(() => {
          setSuccess(false);
          setAnimateClose(false);
          onCancel();
        }, 350);
      }, 900);
    } catch (err) {
      setUploadingDoc(false);
      setError(err.message || 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`create-blog-modal modal-animate${animateClose ? ' modal-close' : ''}`}>
      <form className="create-blog-form" onSubmit={handleSubmit}>
        <h2>Create New {label}</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-checkmark">✔ {label} Created!</div>}
        <div className="form-group">
          <label>Post Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="input-animate">
            {postTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="input-animate" />
        </div>
        {type !== 'job' && (
          <div className="form-group">
            <label>Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} required className="input-animate" />
          </div>
        )}
        {type === 'job' && (
          <>
            <div className="form-group">
              <label>Job Opening Link</label>
              <input type="url" value={jobLink} onChange={e => setJobLink(e.target.value)} required className="input-animate" placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Referral Info <span style={{color:'#888'}}>(optional)</span></label>
              <input type="text" value={referralInfo} onChange={e => setReferralInfo(e.target.value)} className="input-animate" placeholder="Referral details, contact, etc." />
            </div>
          </>
        )}
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-animate">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Tags <span style={{color:'#888'}}>(comma separated)</span></label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. math, ai, cs201" className="input-animate" />
        </div>
        <div className="form-group">
          <label>Image <span style={{color:'#888'}}>(optional)</span></label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="input-animate" />
          {preview && <img src={preview} alt="Preview" className="blog-image-preview" />}
        </div>
        {type === 'note' && (
          <div className="form-group">
            <label>Attach Document <span style={{color:'#888'}}>(PDF, DOCX, etc.) <span style={{color:'red'}}>*</span></span></label>
            <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.csv,.md" onChange={handleDocumentChange} className="input-animate" />
            {documentName && <div className="attached-file-name">📎 {documentName}</div>}
            {uploadingDoc && <div className="spinner" style={{marginTop:'0.5em'}}></div>}
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting || success}>
            {isSubmitting ? <span className="spinner"></span> : `Create`}
          </button>
          <button type="button" className="cancel-btn" onClick={() => { setAnimateClose(true); setTimeout(onCancel, 350); }} disabled={isSubmitting || success}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost; 