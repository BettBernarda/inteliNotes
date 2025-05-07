// =============================
//   FUNCIONALIDADES DO PROJETO
// =============================

const notesContainer = document.getElementById('notes-container');
const noteInput = document.getElementById('note-input');
const addNoteButton = document.getElementById('add-note');
const searchInput = document.getElementById('search');

// Carregar notas salvas
window.onload = () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => createNoteElement(note));
    setClipboardAsPlaceholder(); // Define o conteúdo do clipboard como placeholder
};

// Adicionar nova nota
addNoteButton.addEventListener('click', () => {
    let noteText = noteInput.value.trim();
    // Se não houver texto no input, tenta pegar o conteúdo do clipboard
    if (!noteText) {
        navigator.clipboard.readText()
            .then(clipboardText => {
                if (clipboardText) {
                    noteText = clipboardText;
                    noteInput.placeholder = clipboardText; // Atualiza o placeholder com o conteúdo do clipboard
                    createNoteElement(noteText);
                    saveNoteToLocalStorage(noteText);
                    noteInput.value = ''; // Limpar o campo de input após adicionar
                } else {
                    alert('Não há conteúdo no clipboard!');
                }
            })
            .catch(err => {
                console.error('Erro ao acessar o clipboard: ', err);
                alert('Erro ao acessar o clipboard.');
            });
    } else {
        createNoteElement(noteText);
        saveNoteToLocalStorage(noteText);
        noteInput.value = ''; // Limpar o campo de input após adicionar
    }
});

// Função para criar o elemento visual da nota
function createNoteElement(text) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
        <p>${text}</p>
        <button class="copy-btn">📋</button>
        <button class="delete-btn">🗑️</button>
    `;

    // Botão de copiar
    noteElement.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Nota copiada para a área de transferência!'))
            .catch(err => console.error('Erro ao copiar:', err));
    });

    // Botão de deletar
    noteElement.querySelector('.delete-btn').addEventListener('click', () => {
        noteElement.remove();
        removeNoteFromLocalStorage(text);
    });

    notesContainer.appendChild(noteElement);
}

// Salvar nota no LocalStorage
function saveNoteToLocalStorage(note) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Remover nota do LocalStorage
function removeNoteFromLocalStorage(note) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.filter(n => n !== note);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

// Busca de notas
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.note').forEach(note => {
        const text = note.querySelector('p').textContent.toLowerCase();
        note.style.display = text.includes(query) ? 'block' : 'none';
    });
});

// Função para redimensionar a caixa de texto
noteInput.addEventListener('input', () => {
    noteInput.style.height = 'auto';
    noteInput.style.height = `${noteInput.scrollHeight}px`; // Ajuste da altura
});

// Função para pegar o conteúdo do clipboard e definir como placeholder
function setClipboardAsPlaceholder() {
    navigator.clipboard.readText()
        .then(text => {
            if (text) {
                noteInput.placeholder = text; // Coloca o conteúdo do clipboard como placeholder
            }
        })
        .catch(err => console.error('Erro ao ler o clipboard: ', err));
}
