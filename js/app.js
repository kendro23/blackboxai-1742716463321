// Estado de la aplicación
const appState = {
    user: null,
    darkMode: true,
    following: new Set(),
    streams: [
        {
            id: 1,
            title: "Stream Title",
            streamer: "Streamer Name",
            category: "Just Chatting",
            viewers: "1.2K",
            thumbnail: "https://picsum.photos/seed/stream1/640/360",
            avatar: "https://picsum.photos/seed/avatar1/40/40"
        },
        {
            id: 2,
            title: "Gaming Stream",
            streamer: "Pro Gamer",
            category: "Valorant",
            viewers: "856",
            thumbnail: "https://picsum.photos/seed/stream2/640/360",
            avatar: "https://picsum.photos/seed/avatar2/40/40"
        },
        {
            id: 3,
            title: "IRL Stream",
            streamer: "Travel Streamer",
            category: "Just Chatting",
            viewers: "2.5K",
            thumbnail: "https://picsum.photos/seed/stream3/640/360",
            avatar: "https://picsum.photos/seed/avatar3/40/40"
        },
        {
            id: 4,
            title: "Art Stream",
            streamer: "Creative Artist",
            category: "Art",
            viewers: "5.1K",
            thumbnail: "https://picsum.photos/seed/stream4/640/360",
            avatar: "https://picsum.photos/seed/avatar4/40/40"
        }
    ]
};

// Autenticación
function showAuthModal(type) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-twitch-gray p-6 rounded-lg w-96">
            <h2 class="text-xl font-bold mb-4">${type === 'login' ? 'Log In' : 'Sign Up'}</h2>
            <form id="authForm" class="space-y-4">
                <input type="text" placeholder="Username" class="w-full bg-gray-900 rounded p-2">
                <input type="password" placeholder="Password" class="w-full bg-gray-900 rounded p-2">
                ${type === 'signup' ? '<input type="email" placeholder="Email" class="w-full bg-gray-900 rounded p-2">' : ''}
                <button type="submit" class="w-full bg-twitch-purple hover:bg-purple-700 py-2 rounded">
                    ${type === 'login' ? 'Log In' : 'Sign Up'}
                </button>
            </form>
            <button onclick="this.parentElement.parentElement.remove()" class="absolute top-2 right-2 text-gray-500 hover:text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    modal.querySelector('#authForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.querySelector('input[type="text"]').value;
        appState.user = { username };
        updateUI();
        modal.remove();
        showNotification(`Successfully ${type === 'login' ? 'logged in' : 'signed up'}!`);
    });

    document.body.appendChild(modal);
}

// Búsqueda
function handleSearch(query) {
    query = query.toLowerCase();
    const streams = appState.streams.filter(stream => 
        stream.title.toLowerCase().includes(query) ||
        stream.streamer.toLowerCase().includes(query) ||
        stream.category.toLowerCase().includes(query)
    );
    renderStreams(streams);
}

// Sistema de seguimiento
function toggleFollow(streamerId) {
    if (!appState.user) {
        showAuthModal('login');
        return;
    }

    if (appState.following.has(streamerId)) {
        appState.following.delete(streamerId);
        showNotification('Unfollowed successfully!');
    } else {
        appState.following.add(streamerId);
        showNotification('Followed successfully!');
    }
    updateUI();
}

// Notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-twitch-purple text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Toggle modo oscuro/claro
function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    document.documentElement.classList.toggle('dark');
    showNotification(`Switched to ${appState.darkMode ? 'dark' : 'light'} mode`);
}

// Renderizar streams
function renderStreams(streams = appState.streams) {
    const container = document.querySelector('#streamContainer');
    if (!container) return;

    container.innerHTML = streams.map(stream => `
        <div class="bg-twitch-gray rounded-lg overflow-hidden">
            <div class="relative">
                <div class="aspect-w-16 aspect-h-9">
                    <img src="${stream.thumbnail}" alt="Stream preview" class="w-full h-full object-cover">
                    <div class="absolute top-2 left-2 bg-red-600 text-xs px-2 py-1 rounded">
                        LIVE
                    </div>
                    <div class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-xs px-2 py-1 rounded">
                        ${stream.viewers} viewers
                    </div>
                </div>
            </div>
            <div class="p-3">
                <div class="flex items-start space-x-3">
                    <img src="${stream.avatar}" alt="Streamer avatar" class="w-10 h-10 rounded-full">
                    <div>
                        <h3 class="font-medium">${stream.title}</h3>
                        <p class="text-sm text-gray-400">${stream.streamer}</p>
                        <p class="text-sm text-gray-400">${stream.category}</p>
                    </div>
                    <button onclick="toggleFollow(${stream.id})" 
                            class="ml-auto text-sm ${appState.following.has(stream.id) ? 'text-twitch-purple' : 'text-gray-400'} hover:text-twitch-purple">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Actualizar UI basado en el estado
function updateUI() {
    const authButtons = document.querySelector('#authButtons');
    const userProfile = document.querySelector('#userProfile');
    const searchInput = document.querySelector('#searchInput');

    if (appState.user) {
        authButtons.innerHTML = `
            <span class="text-white">${appState.user.username}</span>
            <button onclick="appState.user = null; updateUI()" class="bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded font-medium">
                Log Out
            </button>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="showAuthModal('login')" class="bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded font-medium">
                Log In
            </button>
            <button onclick="showAuthModal('signup')" class="bg-twitch-purple hover:bg-purple-700 px-4 py-1.5 rounded font-medium">
                Sign Up
            </button>
        `;
    }

    renderStreams();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar UI
    updateUI();

    // Búsqueda
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // Toggle modo oscuro
    const darkModeToggle = document.querySelector('#darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
});