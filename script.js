/*
 * BLOOMBOX 20/10/2026
 * 3D Gift + Personalized Card + Secret Gift Voucher
 * Âm thanh được tạo trực tiếp bằng Web Audio API.
 */

// ==================== 1. NGƯỜI NHẬN ====================

const coworkers = {
  "lê": {
    call: "chị Lê",
    self: "em",
    address: "chị",
    closing: "Em chúc chị luôn vui vẻ, xinh đẹp và hạnh phúc nhé! 🌷"
  },
  "thương": {
    call: "chị Thương",
    self: "em",
    address: "chị",
    closing: "Em chúc chị luôn vui vẻ, xinh đẹp và hạnh phúc nhé! 🌷"
  },
  "hương": {
    call: "chị Hương",
    self: "em",
    address: "chị",
    closing: "Em chúc chị luôn vui vẻ, xinh đẹp và hạnh phúc nhé! 🌷"
  },
  "dung": {
    call: "chị Dung",
    self: "em",
    address: "chị",
    closing: "Em chúc chị luôn vui vẻ, xinh đẹp và hạnh phúc nhé! 🌷"
  },
  "vân": {
    call: "em Vân",
    self: "anh",
    address: "em",
    closing: "Anh chúc em luôn rạng rỡ, vui vẻ và gặp thật nhiều điều tốt đẹp nhé! 💗"
  },
  "phương": {
    call: "em Phương",
    self: "anh",
    address: "em",
    closing: "Anh chúc em luôn rạng rỡ, vui vẻ và gặp thật nhiều điều tốt đẹp nhé! 💗"
  },
  "phượng": {
    call: "cháu Phượng",
    self: "chú",
    address: "cháu",
    closing: "Chú chúc cháu luôn vui tươi, hạnh phúc và gặp thật nhiều may mắn nhé! 🌸"
  }
};

// ==================== 2. LỜI CHÚC ====================

const wishes = [
  "luôn xinh tươi, vui vẻ và gặp toàn chuyện tốt lành! 🌷",
  "mỗi ngày đều có lý do để cười và luôn được mọi người yêu quý! 💗",
  "công việc thuận lợi, cuộc sống ngọt ngào như trà sữa! 🧋",
  "luôn rạng rỡ, tự tin và gặp thật nhiều may mắn! ✨",
  "có thật nhiều niềm vui, yêu thương và những bất ngờ đáng yêu! 🎁",
  "luôn hạnh phúc và có thật nhiều ngày tuyệt vời! 🌸",
  "đi làm vui vẻ, tan làm nhẹ nhõm và ngày nào cũng tràn đầy năng lượng! 🍰",
  "mọi điều dễ thương nhất sẽ đến với mình! 💕",
  "luôn giữ nụ cười và có những ngày thật bình yên! 🌼",
  "có một ngày 20/10 thật vui vẻ, ăn ngon, ngủ ngon và luôn yêu đời! 🩷"
];

// ==================== 3. DANH SÁCH QUÀ ====================

const prizes = [
  { name: "Một cốc trà sữa", icon: "🧋", limit: 45000 },
  { name: "Một phần bánh ngọt", icon: "🍰", limit: 45000 },
  { name: "Một cốc cà phê hoặc đồ uống", icon: "☕", limit: 40000 },
  { name: "Một phần kem hoặc sữa chua", icon: "🍦", limit: 35000 },
  { name: "Một món ăn vặt yêu thích", icon: "🍪", limit: 35000 }
];

// ==================== 4. LẤY PHẦN TỬ HTML ====================

const $ = id => document.getElementById(id);

const nameInput = $("recipientName");
const nameError = $("nameError");
const greeting = $("greeting");
const message = $("message");
const giftBox = $("gift");
const openButton = $("openButton");
const result = $("result");

const cardRecipient = $("cardRecipient");
const wishText = $("wish");
const prizeIcon = $("prizeIcon");
const giftName = $("giftName");
const prizeLimit = $("prizeLimit");
const voucherDesc = $("voucherDesc");
const voucherNote = $("voucherNote");
const signature = $("signature");
const closing = $("closing");

const revealButton = $("revealButton");
const prizeReveal = $("prizeReveal");
const replayButton = $("replayButton");

const soundToggle = $("soundToggle");
const soundIcon = $("soundIcon");
const soundLabel = $("soundLabel");
const toast = $("toast");

// ==================== 5. TRẠNG THÁI VÀ ÂM THANH ====================

let soundEnabled = false;
let audioContext = null;
let giftOpened = false;
let prizeRevealed = false;
let selectedPerson = null;
let selectedPrize = null;
let selectedWish = null;

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playTone(frequency, startTime, duration, type = "sine", volume = 0.045) {
  if (!soundEnabled) return;

  try {
    const context = getAudioContext();
    if (!context) return;

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  } catch (error) {
    console.warn("BloomBox: Không thể phát âm thanh.", error);
  }
}

function playSound(kind) {
  if (!soundEnabled) return;

  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;

  if (kind === "open") {
    playTone(440, now, 0.16);
    playTone(554.37, now + 0.13, 0.18);
    playTone(659.25, now + 0.27, 0.32);
  }

  if (kind === "reveal") {
    playTone(523.25, now, 0.13);
    playTone(659.25, now + 0.12, 0.13);
    playTone(783.99, now + 0.24, 0.28);
  }

  if (kind === "click") {
    playTone(659.25, now, 0.08, "sine", 0.025);
  }
}

function updateSoundButton() {
  if (soundIcon) soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
  if (soundLabel) soundLabel.textContent = soundEnabled ? "Tắt âm thanh" : "Bật âm thanh";
  if (soundToggle) {
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.setAttribute(
      "aria-label",
      soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"
    );
  }
}

// ==================== 6. HÀM HỖ TRỢ ====================

function normalizeName(name) {
  return name.trim().toLocaleLowerCase("vi").normalize("NFC");
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getGreeting(name) {
  const key = normalizeName(name);

  if (coworkers[key]) {
    return coworkers[key];
  }

  return {
    call: name.trim(),
    self: "mình",
    address: "bạn",
    closing: "Chúc bạn luôn vui vẻ, hạnh phúc và gặp thật nhiều may mắn nhé! 💗"
  };
}

function capitalizeFirst(text) {
  return text.charAt(0).toLocaleUpperCase("vi") + text.slice(1);
}

function getPersonalizedWish(wish, person) {
  return `Chúc ${person.address} ${wish}`;
}

function showToast(text) {
  if (!toast) return;

  toast.textContent = text;
  toast.hidden = false;

  if (showToast.timeout) {
    clearTimeout(showToast.timeout);
  }

  showToast.timeout = setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

// ==================== 7. HOA, TIM VÀ PHÁO GIẤY ====================

function createCelebration(count = 22) {
  const emojis = ["💗", "💕", "🌸", "🌷", "✨", "💖", "🌼"];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");

    particle.className = "celebration-particle";
    particle.textContent = randomItem(emojis);
    particle.style.left = `${5 + Math.random() * 90}vw`;
    particle.style.top = `${45 + Math.random() * 40}vh`;
    particle.style.animationDelay = `${Math.random() * 0.4}s`;

    document.body.appendChild(particle);

    particle.addEventListener(
      "animationend",
      () => particle.remove(),
      { once: true }
    );
  }
}

function createConfetti(count = 55) {
  const colors = [
    "#f5a2c4", "#ffd879", "#c7a7f5",
    "#ffbfd7", "#ffffff", "#e67eab"
  ];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = randomItem(colors);
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.setProperty(
      "--drift",
      `${Math.round((Math.random() - 0.5) * 180)}px`
    );

    document.body.appendChild(piece);

    piece.addEventListener(
      "animationend",
      () => piece.remove(),
      { once: true }
    );
  }
}

// ==================== 8. MỞ HỘP QUÀ & TƯƠNG TÁC ====================

function openGift() {
  if (giftOpened) return;

  const name = nameInput.value.trim();

  if (!name) {
    nameError.hidden = false;
    nameInput.focus();
    showToast("Nhập tên trước để nhận quà nhé! 💗");
    return;
  }

  giftOpened = true;
  nameError.hidden = true;

  selectedPerson = getGreeting(name);
  selectedWish = randomItem(wishes);
  selectedPrize = randomItem(prizes);

  openButton.disabled = true;
  openButton.textContent = "Hộp quà đang mở... ✨";

  greeting.textContent =
    `Món quà nhỏ dành riêng cho ${selectedPerson.call} 💗`;

  message.textContent =
    `Một bất ngờ dành riêng cho ${selectedPerson.call} đang được chuẩn bị...`;

  giftBox.classList.remove("gift-open", "gift-shake");
  void giftBox.offsetWidth;
  giftBox.classList.add("gift-shake");

  playSound("open");
  createCelebration(12);

  window.setTimeout(() => {
    giftBox.classList.remove("gift-shake");
    giftBox.classList.add("gift-open");

    createCelebration(24);
    createConfetti(32);
    playSound("reveal");

    message.textContent =
      `Hộp quà đã mở! Một tấm thiệp đang chờ ${selectedPerson.call} 💌`;

    cardRecipient.textContent =
      `Gửi ${capitalizeFirst(selectedPerson.call)} 💗`;

    wishText.textContent =
      getPersonalizedWish(selectedWish, selectedPerson);

    // Chuẩn bị voucher nhưng chưa tiết lộ món quà
    prizeIcon.textContent = selectedPrize.icon;
    giftName.textContent = selectedPrize.name;

    prizeLimit.textContent =
      `Tối đa ${selectedPrize.limit.toLocaleString("vi-VN")}đ`;

    voucherDesc.textContent =
      `Một món ngon dành riêng cho ${selectedPerson.address}! 💗`;

    voucherNote.textContent =
      `Chọn món ${selectedPerson.address} thích rồi báo ${selectedPerson.self} nhé 💕`;

    signature.textContent =
      `Món quà nhỏ này ${selectedPerson.self} mời ${selectedPerson.call} nhé! 💝`;

    closing.textContent = selectedPerson.closing;

    result.hidden = false;
    result.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    openButton.textContent = "Đã mở hộp quà 💗";

    showToast(`Thiệp riêng dành cho ${selectedPerson.call} đã sẵn sàng!`);
  }, 900);
}

function revealPrize() {
  if (!giftOpened || !selectedPrize || prizeRevealed) return;

  prizeRevealed = true;
  revealButton.disabled = true;
  revealButton.setAttribute("aria-expanded", "true");
  revealButton.classList.add("revealing");

  const mysteryFace = $("mysteryFace");

  if (mysteryFace) {
    mysteryFace.innerHTML = `
      <span class="mystery-sparkles" aria-hidden="true">✦ ✧ ✦</span>
      <span class="mystery-question">💗</span>
      <span class="mystery-title">A LITTLE SURPRISE!</span>
      <span class="mystery-hint">Quà của bạn sắp xuất hiện...</span>
    `;
  }

  playSound("reveal");
  createCelebration(15);

  window.setTimeout(() => {
    prizeReveal.hidden = false;
    revealButton.hidden = true;

    createCelebration(28);
    createConfetti(55);
    playSound("reveal");

    message.textContent =
      `Chúc mừng ${selectedPerson.call}! Món quà bí mật đã được bật mí 🎁`;

    prizeReveal.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 650);
}

function replayGreeting() {
  if (!selectedPerson) return;

  result.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  createCelebration(10);
  playSound("click");
}

// ==================== 9. KHỞI TẠO BLOOMBOX ====================

function initializeBloomBox() {
  updateSoundButton();

  soundToggle.addEventListener("click", async () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      const context = getAudioContext();

      if (context && context.state === "suspended") {
        try {
          await context.resume();
        } catch (error) {
          console.warn("BloomBox: Âm thanh chưa sẵn sàng.", error);
        }
      }

      updateSoundButton();
      playSound("click");
      showToast("Đã bật âm thanh cho BloomBox 🎵");
    } else {
      updateSoundButton();
      showToast("Đã tắt âm thanh 🔇");
    }
  });

  nameInput.addEventListener("input", () => {
    nameError.hidden = true;
  });

  nameInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !giftOpened) {
      openGift();
    }
  });

  openButton.addEventListener("click", openGift);
  revealButton.addEventListener("click", revealPrize);
  replayButton.addEventListener("click", replayGreeting);
}

// ==================== 10. KIỂM TRA & CHẠY ====================

const requiredElements = [
  nameInput, nameError, greeting, message, giftBox,
  openButton, result, cardRecipient, wishText,
  prizeIcon, giftName, prizeLimit, voucherDesc,
  voucherNote, signature, closing, revealButton,
  prizeReveal, replayButton, soundToggle
];

if (requiredElements.some(element => !element)) {
  console.error(
    "BloomBox: Thiếu phần tử HTML. Hãy kiểm tra index.html và script.js."
  );
  if (message) {
    message.textContent = "Trang quà tặng đang thiếu thành phần. Hãy kiểm tra lại các file.";
  }
} else {
  initializeBloomBox();
}