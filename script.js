const profile = document.getElementById('profileToggle');

profile.addEventListener('click', (e) => {
  profile.classList.toggle('open');
  e.stopPropagation();
});

document.addEventListener('click', () => {
  profile.classList.remove('open');
});

const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/*
  ตั้งค่ารายการอุปกรณ์และจำนวนที่พร้อมให้ยืมตรงนี้
  - name: ชื่ออุปกรณ์
  - unit: หน่วยนับ (ลูก / อัน / ชุด ฯลฯ)
  - available: จำนวนที่พร้อมให้ยืม ณ วันที่เริ่มใช้งานระบบ
  แก้ไขค่า available ตรงนี้เพื่อเปลี่ยนจำนวนเริ่มต้น (มีผลเฉพาะตอนที่ยังไม่เคยมีการจองเกิดขึ้นในเบราว์เซอร์นั้น)
*/
const EQUIPMENT_CONFIG = [
  { name: 'ลูกฟุตบอล',       unit: 'ลูก', available: 18 },
  { name: 'ลูกวอลเลย์บอล',   unit: 'ลูก', available: 10 },
  { name: 'ลูกบาสเกตบอล',    unit: 'ลูก', available: 6 },
  { name: 'ไม้แบดมินตัน',     unit: 'อัน', available: 12 },
  { name: 'ตาข่ายวอลเลย์บอล', unit: 'ชุด', available: 1 },
  { name: 'ไม้ปิงปอง',        unit: 'อัน', available: 8 },
  { name: 'ลูกปิงปอง',        unit: 'ลูก', available: 30 },
  { name: 'ลูกแบดมินตัน',     unit: 'ลูก', available: 24 }
];

const EQUIPMENT_STOCK_KEY = 'sportsEquip_equipmentStock';

function loadEquipmentStock() {
  let stock = {};
  try {
    const raw = localStorage.getItem(EQUIPMENT_STOCK_KEY);
    if (raw) stock = JSON.parse(raw);
  } catch (e) {
    stock = {};
  }

  let changed = false;
  EQUIPMENT_CONFIG.forEach(item => {
    if (!(item.name in stock)) {
      stock[item.name] = item.available;
      changed = true;
    }
  });
  if (changed) saveEquipmentStock(stock);

  return stock;
}

function saveEquipmentStock(stock) {
  localStorage.setItem(EQUIPMENT_STOCK_KEY, JSON.stringify(stock));
}

function adjustEquipmentStock(name, delta) {
  const stock = loadEquipmentStock();
  const current = stock[name] !== undefined ? stock[name] : 0;
  stock[name] = Math.max(0, current + delta);
  saveEquipmentStock(stock);
  return stock[name];
}

function getEquipmentUnit(name) {
  const item = EQUIPMENT_CONFIG.find(e => e.name === name);
  return item ? item.unit : 'ชิ้น';
}

const equipmentGrid = document.getElementById('equipmentGrid');

if (equipmentGrid) {
  function renderEquipmentGrid() {
    const stock = loadEquipmentStock();

    equipmentGrid.innerHTML = EQUIPMENT_CONFIG.map(item => `
      <div class="equip-card">
        <div class="equip-img-placeholder">ตรงนี้คือช่องใส่รูป</div>
        <p class="equip-name">${item.name}</p>
        <p class="equip-meta">พร้อมให้ยืม ${stock[item.name]} ${item.unit}</p>
        <button class="btn-borrow">ยืมเลย</button>
      </div>
    `).join('');

    equipmentGrid.querySelectorAll('.btn-borrow').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        window.location.href = 'booking.html';
      });
    });
  }

  renderEquipmentGrid();
}

const PROFILE_STORAGE_KEY = 'sportsEquip_profileData';

const DEFAULT_PROFILE_DATA = {
  name: 'นางสาวรัตนกร แสงใส',
  email: 'rattanakorn@example.com',
  phone: '083-123-4567',
  studentId: '12345',
  className: 'ม.5/3',
  role: 'นักเรียน',
  birthday: ''
};

function loadProfileData() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE_DATA };
    return { ...DEFAULT_PROFILE_DATA, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_PROFILE_DATA };
  }
}

function saveProfileData(data) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
}

const valName = document.getElementById('val-name');
const valEmail = document.getElementById('val-email');
const valPhone = document.getElementById('val-phone');
const valStudentId = document.getElementById('val-studentid');
const valClass = document.getElementById('val-class');
const valRole = document.getElementById('val-role');
const valBirthday = document.getElementById('val-birthday');

function formatThaiDate(isoDate) {
  if (!isoDate) return '-';
  const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                   'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return '-';
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

if (valName) {
  const data = loadProfileData();
  valName.textContent = data.name;
  if (valEmail) valEmail.textContent = data.email;
  if (valPhone) valPhone.textContent = data.phone;
  if (valStudentId) valStudentId.textContent = data.studentId;
  if (valClass) valClass.textContent = data.className;
  if (valRole) valRole.textContent = data.role;
  if (valBirthday) valBirthday.textContent = formatThaiDate(data.birthday);
}

const studentSettingsForm = document.getElementById('studentSettingsForm');

if (studentSettingsForm) {
  const inputName = document.getElementById('input-name');
  const inputEmail = document.getElementById('input-email');
  const inputPhone = document.getElementById('input-phone');
  const inputStudentId = document.getElementById('input-studentid');
  const inputClass = document.getElementById('input-class');
  const inputRole = document.getElementById('input-role');
  const inputBirthday = document.getElementById('input-birthday');
  const saveMsg = document.getElementById('saveMsg');
  const cancelBtn = document.getElementById('cancelBtn');

  function fillStudentFormFromStorage() {
    const data = loadProfileData();
    inputName.value = data.name;
    inputEmail.value = data.email;
    inputPhone.value = data.phone;
    inputStudentId.value = data.studentId;
    inputClass.value = data.className;
    inputRole.value = data.role;
    inputBirthday.value = data.birthday;
  }
  fillStudentFormFromStorage();

  studentSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    saveProfileData({
      name: inputName.value.trim() || DEFAULT_PROFILE_DATA.name,
      email: inputEmail.value.trim() || DEFAULT_PROFILE_DATA.email,
      phone: inputPhone.value.trim() || DEFAULT_PROFILE_DATA.phone,
      studentId: inputStudentId.value.trim() || DEFAULT_PROFILE_DATA.studentId,
      className: inputClass.value.trim() || DEFAULT_PROFILE_DATA.className,
      role: inputRole.value || DEFAULT_PROFILE_DATA.role,
      birthday: inputBirthday.value
    });

    saveMsg.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => saveMsg.classList.remove('show'), 3000);
  });

  cancelBtn.addEventListener('click', () => {
    fillStudentFormFromStorage();
    saveMsg.classList.remove('show');
  });
}

const BOOKINGS_STORAGE_KEY = 'sportsEquip_bookings_v3';

function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveBookings(list) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
}

function addDays(isoDate, days) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatThaiDateShort(isoDate) {
  if (!isoDate) return '-';
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return '-';
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

function formatTimeRange(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const endH = (h + 2) % 24;
  const pad = n => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)} - ${pad(endH)}:${pad(m)} น.`;
}

function statusBadge(status) {
  const map = {
    'รออนุมัติ': 'badge-pending',
    'กำลังยืม': 'badge-active',
    'ยกเลิก': 'badge-cancelled',
    'คืนแล้ว': 'badge-returned'
  };
  return `<span class="badge ${map[status] || 'badge-pending'}">${status}</span>`;
}

const bookingForm = document.getElementById('bookingForm');
const bookingListEl = document.getElementById('bookingList');
const bkEquipmentSelect = document.getElementById('bk-equipment');

if (bookingForm && bookingListEl) {

  function populateEquipmentSelect() {
    const stock = loadEquipmentStock();
    const prevValue = bkEquipmentSelect.value;

    bkEquipmentSelect.innerHTML = '<option value="">เลือกอุปกรณ์</option>' +
      EQUIPMENT_CONFIG.map(item => {
        const qty = stock[item.name];
        const disabled = qty <= 0 ? 'disabled' : '';
        const label = qty <= 0
          ? `${item.name} (ของหมด)`
          : `${item.name} (พร้อมให้ยืม ${qty} ${item.unit})`;
        return `<option value="${item.name}" ${disabled}>${label}</option>`;
      }).join('');

    if (prevValue) bkEquipmentSelect.value = prevValue;
  }

  function renderBookingList() {
    const list = loadBookings().filter(b => b.status === 'กำลังยืม');

    if (list.length === 0) {
      bookingListEl.innerHTML = `<p class="empty-state">ยังไม่มีรายการที่ยืมอยู่ กรอกฟอร์มด้านซ้ายเพื่อเริ่มจองอุปกรณ์</p>`;
      return;
    }

    bookingListEl.innerHTML = list.map(b => {
      const actionHtml = `<button class="btn-mini" data-action="return" data-id="${b.id}">คืนอุปกรณ์</button>`;
      return `
        <div class="booking-item" data-id="${b.id}">
          <div class="booking-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          </div>
          <div class="booking-info">
            <p class="b-name">${b.equipment}</p>
            <p class="b-time">${formatThaiDateShort(b.requestDate)} เวลา ${formatTimeRange(b.time)}</p>
          </div>
          <div class="booking-item-status">
            ${statusBadge(b.status)}
            ${actionHtml}
          </div>
        </div>
      `;
    }).join('');

    bookingListEl.querySelectorAll('[data-action="return"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('ยืนยันว่าคืนอุปกรณ์ชิ้นนี้แล้วใช่หรือไม่?')) return;
        const id = Number(btn.dataset.id);
        const list = loadBookings();
        const idx = list.findIndex(b => b.id === id);
        if (idx !== -1) {
          list[idx].status = 'คืนแล้ว';
          list[idx].returnDate = todayISO();
          saveBookings(list);
          adjustEquipmentStock(list[idx].equipment, 1);
          window.location.href = 'history.html';
        }
      });
    });
  }

  renderBookingList();
  populateEquipmentSelect();

  function daysInMonth(monthNum, yearAD) {
    return new Date(yearAD, monthNum, 0).getDate();
  }

  function parseThaiDateInput(text) {
    const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text.trim());
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const yearBE = Number(match[3]);
    const yearAD = yearBE - 543;

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > daysInMonth(month, yearAD)) return null;
    if (yearBE < 2400 || yearBE > 2700) return null;

    const pad = n => String(n).padStart(2, '0');
    return `${yearAD}-${pad(month)}-${pad(day)}`;
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const equipment = bkEquipmentSelect.value;
    const dateText = document.getElementById('bk-date').value;
    const time = document.getElementById('bk-time').value;
    const purpose = document.getElementById('bk-purpose').value.trim();
    const note = document.getElementById('bk-note').value.trim();

    if (!equipment || !dateText || !time || !purpose) return;

    const date = parseThaiDateInput(dateText);
    if (!date) {
      alert('กรุณากรอกวันที่ให้ถูกต้องในรูปแบบ วว/ดด/ปปปป (พ.ศ.) เช่น 05/03/2569');
      return;
    }

    const stock = loadEquipmentStock();
    if (!stock[equipment] || stock[equipment] <= 0) {
      alert('อุปกรณ์ชิ้นนี้ไม่พร้อมให้ยืมแล้ว กรุณาเลือกอุปกรณ์อื่น');
      populateEquipmentSelect();
      return;
    }

    const list = loadBookings();
    list.unshift({
      id: Date.now(),
      equipment,
      requestDate: date,
      time,
      purpose,
      note,
      dueDate: addDays(date, 2),
      returnDate: null,
      status: 'กำลังยืม'
    });
    saveBookings(list);
    adjustEquipmentStock(equipment, -1);

    bookingForm.reset();
    renderBookingList();
    populateEquipmentSelect();

    const successMsg = document.getElementById('bookingSuccessMsg');
    if (successMsg) {
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 3000);
    }
  });

  document.getElementById('bk-clear').addEventListener('click', () => {
    bookingForm.reset();
  });
}

const historyTableBody = document.getElementById('historyTableBody');
const historyPagination = document.getElementById('historyPagination');

if (historyTableBody && historyPagination) {
  const PAGE_SIZE = 4;
  let currentPage = 1;

  function historyStatusBadge(b) {
    if (b.status === 'ยกเลิก') return '<span class="badge badge-cancelled">ยกเลิก</span>';
    if (b.status === 'คืนแล้ว') return '<span class="badge badge-returned">คืนแล้ว</span>';
    return '<span class="badge badge-notreturned">ยังไม่คืน</span>';
  }

  function renderHistoryPage(page) {
    const all = loadBookings();

    if (all.length === 0) {
      historyTableBody.innerHTML = `<tr><td colspan="7" class="empty-state">ยังไม่มีประวัติการยืม-คืน</td></tr>`;
      historyPagination.innerHTML = '';
      return;
    }

    const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(1, page), totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = all.slice(start, start + PAGE_SIZE);

    historyTableBody.innerHTML = pageItems.map((b, i) => {
      const canReturn = (b.status === 'กำลังยืม');
      return `
        <tr>
          <td>${start + i + 1}</td>
          <td>${b.equipment}</td>
          <td>${formatThaiDateShort(b.requestDate)}</td>
          <td>${formatThaiDateShort(b.dueDate)}</td>
          <td>${b.returnDate ? formatThaiDateShort(b.returnDate) : '-'}</td>
          <td>${historyStatusBadge(b)}</td>
          <td>${canReturn ? `<button class="btn-mini" data-id="${b.id}">คืนอุปกรณ์</button>` : ''}</td>
        </tr>
      `;
    }).join('');

    historyTableBody.querySelectorAll('.btn-mini').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const list = loadBookings();
        const idx = list.findIndex(b => b.id === id);
        if (idx !== -1) {
          list[idx].status = 'คืนแล้ว';
          list[idx].returnDate = todayISO();
          saveBookings(list);
          adjustEquipmentStock(list[idx].equipment, 1);
          renderHistoryPage(currentPage);
        }
      });
    });

    const pageButtons = [];
    pageButtons.push(`<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`);
    for (let p = 1; p <= totalPages; p++) {
      pageButtons.push(`<button class="page-btn${p === currentPage ? ' active' : ''}" data-page="${p}">${p}</button>`);
    }
    pageButtons.push(`<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`);
    historyPagination.innerHTML = pageButtons.join('');

    historyPagination.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => renderHistoryPage(Number(btn.dataset.page)));
    });
  }

  renderHistoryPage(1);

  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (!confirm('ต้องการล้างประวัติการยืม-คืนทั้งหมดใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;

      saveBookings([]);
      renderHistoryPage(1);
    });
  }
}
