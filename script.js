const staff = [];
const clockedIn = {};
const records = [];

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en‑GB', { hour12: false });
}

document.getElementById('addBtn').onclick = () => {
  const name = document.getElementById('staffName').value.trim();
  const wage = parseFloat(document.getElementById('wage').value);
  if (!name || isNaN(wage)) return alert('Enter name and wage');
  const id = Date.now();
  staff.push({ id, name, wage });
  document.getElementById('staffName').value = '';
  document.getElementById('wage').value = '';
  renderStaff();
};

function renderStaff() {
  const container = document.getElementById('staffContainer');
  container.innerHTML = '';
  staff.forEach(s => {
    const div = document.createElement('div');
    div.textContent = `${s.name} (£${s.wage}/h) `;
    const btn = document.createElement('button');
    if (clockedIn[s.id]) {
      btn.textContent = 'Clock Out';
      btn.onclick = () => handleClockOut(s.id);
    } else {
      btn.textContent = 'Clock In';
      btn.onclick = () => handleClockIn(s.id);
    }
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function handleClockIn(id) {
  clockedIn[id] = Date.now();
  renderStaff();
}

function handleClockOut(id) {
  const inTime = clockedIn[id];
  const out = Date.now();
  const diff = (out - inTime) / 1000 / 60 / 60; // hours
  const s = staff.find(x => x.id === id);
  const pay = diff * s.wage;
  records.push({ name: s.name, inTime, out, hours: diff.toFixed(2), pay: pay.toFixed(2) });
  delete clockedIn[id];
  renderStaff();
  renderRecords();
}

function renderRecords() {
  const tbody = document.getElementById('recordsBody');
  tbody.innerHTML = '';
  records.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.name}</td>
      <td>${formatTime(r.inTime)}</td><td>${formatTime(r.out)}</td>
      <td>${r.hours}</td><td>${r.pay}</td>`;
    tbody.appendChild(tr);
  });
  const total = records.reduce((a, r) => a + parseFloat(r.pay), 0);
  document.getElementById('totalPay').textContent = `Total Pay: £${total.toFixed(2)}`;
}

renderStaff();
