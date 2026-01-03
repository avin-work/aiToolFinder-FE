const API_BASE = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    loadTools();
    
    // Add Tool Form
    document.getElementById('add-tool-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const toolData = {
            name: document.getElementById('tool-name').value,
            useCase: document.getElementById('tool-usecase').value,
            category: document.getElementById('tool-category').value,
            priceType: document.getElementById('tool-pricing').value,
            rating: 0
        };
        try {
            await axios.post(`${API_BASE}/admin/tool`, toolData);
            alert('Tool added!');
            e.target.reset();
            switchTab('user');
        } catch (err) { alert("Error adding tool. Check Console."); }
    });
});

async function loadTools() {
    try {
        const cat = document.getElementById('filter-category').value;
        const prc = document.getElementById('filter-pricing').value;

        const endpoint = (cat || prc) ? `${API_BASE}/tools/filter` : `${API_BASE}/tools`;

        const res = await axios.get(endpoint, {
            params: { 
                category: cat || null, 
                priceType: prc || null
            }
        });
        renderTools(res.data);
    } catch (err) { 
        console.error("Filter Error:", err); 
    }
}

function renderTools(tools) {
    const grid = document.getElementById('tools-grid');
    grid.innerHTML = tools.map(tool => {
        const toolId = tool.id || tool._id || tool.ID;
        return `
        <div class="tool-card">
            <div class="card-header">
                <span class="badge">${tool.category}</span>
                <span class="rating-pill">★ ${tool.rating ? tool.rating.toFixed(1) : '0.0'}</span>
            </div>
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-usecase">${tool.useCase}</p>
            <div class="card-footer" style="display:flex; gap:10px; flex-wrap:wrap;">
                <button onclick="openReviewModal('${toolId}', '${tool.name}')" class="btn-review-pill"> Post Review</button>
                <button onclick="fetchApprovedReviews('${toolId}')" class="btn-nav" style="font-size:0.8rem;">View Reviews</button>
                <span style="font-size:0.8rem; color:#94a3b8; margin-left:auto;">${tool.priceType || 'Free'}</span>
            </div>
        </div>
    `}).join('');
}

// --- USER: VIEW APPROVED REVIEWS ---
async function fetchApprovedReviews(toolId) {
    try {
        const res = await axios.get(`${API_BASE}/user/allReviews`);
        // Filter reviews by toolId and status 'APPROVED'
        const approved = res.data.filter(r => r.toolId == toolId && r.status === 'APPROVED');
        
        if (approved.length === 0) {
            alert("No approved reviews for this tool yet.");
        } else {
            const list = approved.map(r => `★ ${r.userRating}: "${r.comment}"`).join('\n\n');
            alert(`Reviews for this tool:\n\n${list}`);
        }
    } catch (err) {
        console.error("Error fetching reviews", err);
    }
}

// --- ADMIN: LOAD PENDING REVIEWS ---
async function loadPendingReviews() {
    try {
        const res = await axios.get(`${API_BASE}/user/allReviews`);
        const pending = res.data.filter(r => r.status === 'PENDING');
        const container = document.getElementById('pending-reviews-list');

        if (pending.length === 0) {
            container.innerHTML = '<p>No pending reviews.</p>';
            return;
        }

        console.log(pending, "pending")
        container.innerHTML = pending.map(rev => `
            <div class="tool-card" style="margin-bottom: 1rem; border-style: dashed;">
                <p><strong>Tool ID:</strong> ${rev.toolId} | <strong>Rating:</strong> ${rev.userRating}</p>
                <p>"${rev.comment}"</p>
                <button onclick="approveReview('${rev.ID}')" class="btn-primary-blue" style="padding: 5px 15px; margin-top:10px;">
                    Approve
                </button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading pending reviews", err);
    }
}

// --- ADMIN: APPROVE ACTION ---
async function approveReview(reviewId) {
    try {
        await axios.put(`${API_BASE}/admin/review/${reviewId}/approve`);
        alert("Review Approved!");
        loadPendingReviews();
        loadTools();  
    } catch (err) {
        console.error("Approval failed", err);
        alert("Check console - make sure the ID matches correctly.");
    }
}

// Update your switchTab to load pending reviews when entering admin mode
function switchTab(view) {
    document.getElementById('user-view').classList.toggle('hidden', view !== 'user');
    document.getElementById('admin-view').classList.toggle('hidden', view !== 'admin');
    if(view === 'user') loadTools();
    if(view === 'admin') loadPendingReviews();
}

function openReviewModal(id, name) {
    document.getElementById('modal-tool-id').value = id;
    console.log(id);
    document.getElementById('modal-tool-name').innerText = `Review ${name}`;
    document.getElementById('review-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('review-modal').classList.remove('active');
}

async function submitReview() {

    const toolId = document.getElementById('modal-tool-id').value;
    console.log(toolId);
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    const reviewData = {
        toolId: parseInt(toolId),      
        userRating: parseInt(rating),
        comment: comment,
        status: "PENDING"        
    };

    try {
        await axios.post(`${API_BASE}/user/review`, reviewData);
        alert('Review posted!');
        closeModal();
        loadTools();
    } catch (err) { alert("Error. Check CORS or API."); }
}
