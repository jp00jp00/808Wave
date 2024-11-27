const audio = document.getElementById('audio');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');

// Alternar play/pause no clique do ícone
playIcon.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playIcon.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="currentColor"></path>'; // Ícone de pausa
  } else {
    audio.pause();
    playIcon.innerHTML = '<path d="M8 5v14l11-7L8 5z" fill="currentColor"></path>'; // Ícone de play
  }
});

// Atualizar a barra de progresso conforme o áudio toca
audio.addEventListener('timeupdate', () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
});

// Permitir que o usuário ajuste a posição do áudio clicando na barra de progresso
progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const newTime = (clickX / width) * audio.duration;
  audio.currentTime = newTime;
});