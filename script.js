document.getElementById('calculate-btn').addEventListener('click', function () {
  const rows = document.querySelectorAll('#input-klasemen tr');
  const data = [];

  rows.forEach((row) => {
    const country = row.cells[1].innerText;
    const wins = parseInt(row.querySelector('.win-input').value) || 0;
    const draws = parseInt(row.querySelector('.draw-input').value) || 0;
    const losses = parseInt(row.querySelector('.lose-input').value) || 0;

    // Total Pertandingan
    let totalMatches = wins + draws + losses;

    // Cek maksimal Pertandingan
    if (totalMatches > 10) {
      alert(`${country} memiliki lebih dari 10 pertandingan! Total pertandingan diatur ke 10.`);
      totalMatches = 10;
    }

    row.querySelector('.matches').innerText = totalMatches;

    const goalsFor = parseInt(row.querySelector('.goals-for-input').value) || 0;
    const goalsAgainst = parseInt(row.querySelector('.goals-against-input').value) || 0;

    // Hitung Poin
    const points = wins * 3 + draws * 1;

    // Selisih Gol
    const goalDifference = goalsFor - goalsAgainst;

    // Simpan Data
    data.push({ country, wins, draws, losses, totalMatches, goalsFor, goalsAgainst, goalDifference, points });
  });

  // Urutkan berdasarkan kriteria yang ditentukan
  data.sort((a, b) => {
    // Jika salah satu tim tidak memiliki nilai, letakkan di paling bawah
    if (a.points === 0 && a.totalMatches === 0 && a.goalDifference === 0) return 1;
    if (b.points === 0 && b.totalMatches === 0 && b.goalDifference === 0) return -1;

    // Urutkan berdasarkan total poin (yang tertinggi di atas)
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    // Jika total poin sama, urutkan berdasarkan total pertandingan (yang terbanyak di atas)
    if (b.totalMatches !== a.totalMatches) {
      return b.totalMatches - a.totalMatches;
    }

    // Jika total pertandingan juga sama, urutkan berdasarkan selisih gol (yang tertinggi di atas)
    return b.goalDifference - a.goalDifference;
  });

  // Hitung Probabilitas
  calculateProbabilities(data);

  // Perbarui Tabel
  const tbody = document.getElementById('input-klasemen');
  tbody.innerHTML = '';

  const topTeams = data.slice(0, 2).map((team) => team.country);

  data.forEach((item) => {
    const isTopTeam = topTeams.includes(item.country) ? 'top-team' : '';

    const row = document.createElement('tr');
    row.innerHTML = `
          <td class="probability">${item.probability1}%</td>
          <td class="${isTopTeam}">${item.country}</td>
          <td class="matches">${item.totalMatches}</td>
          <td><input type="number" value="${item.wins}" min="0" max="10" class="win-input" /></td>
          <td><input type="number" value="${item.draws}" min="0" max="10" class="draw-input" /></td>
          <td><input type="number" value="${item.losses}" min="0" max="10" class="lose-input" /></td>
          <td><input type="number" value="${item.goalsFor}" min="0" class="goals-for-input" /></td>
          <td><input type="number" value="${item.goalsAgainst}" min="0" class="goals-against-input" /></td>
          <td class="goal-difference">${item.goalDifference}</td>
          <td class="points">${item.points}</td>
        `;
    tbody.appendChild(row);
  });
});

// Fungsi Hitung Probabilitas Posisi 1 dan 2
function calculateProbabilities(data) {
  const totalMatches = 10; // Total pertandingan
  let totalMaxPoints = 0;

  // Hanya menghitung tim yang memiliki pertandingan
  const validTeams = data.filter((team) => team.totalMatches > 0);

  validTeams.forEach((team) => {
    team.remainingMatches = totalMatches - team.totalMatches; // Pertandingan yang tersisa
    team.maxPoints = team.points + team.remainingMatches * 3; // Poin maksimum
    totalMaxPoints += team.maxPoints; // Total maksimum poin
  });

  // Pastikan kita tidak membagi dengan 0
  if (totalMaxPoints > 0) {
    validTeams.forEach((team) => {
      team.probability1 = Math.round((team.maxPoints / totalMaxPoints) * 100); // Menghitung probabilitas
    });
  }
}

// Reset Tombol
document.getElementById('reset-btn').addEventListener('click', function () {
  const rows = document.querySelectorAll('#input-klasemen tr');

  // Reset Input
  rows.forEach((row) => {
    row.querySelector('.win-input').value = 0;
    row.querySelector('.draw-input').value = 0;
    row.querySelector('.lose-input').value = 0;
    row.querySelector('.goals-for-input').value = 0;
    row.querySelector('.goals-against-input').value = 0;
    row.querySelector('.matches').innerText = 0;
  });

  // Hapus Probabilitas
  const tbody = document.getElementById('input-klasemen');
  tbody.innerHTML = ''; // Clear existing table rows

  // Reset ke keadaan awal (optional)
  const initialData = [{ country: 'INDONESIA' }, { country: 'AUSTRALIA' }, { country: 'ARAB SAUDI' }, { country: 'CHINA' }, { country: 'JEPANG' }, { country: 'BAHRAIN' }];

  initialData.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
          <td class="probability">0%</td>
          <td>${item.country}</td>
          <td class="matches">0</td>
          <td><input type="number" value="0" min="0" max="10" class="win-input" /></td>
          <td><input type="number" value="0" min="0" max="10" class="draw-input" /></td>
          <td><input type="number" value="0" min="0" max="10" class="lose-input" /></td>
          <td><input type="number" value="0" min="0" class="goals-for-input" /></td>
          <td><input type="number" value="0" min="0" class="goals-against-input" /></td>
          <td class="goal-difference">0</td>
          <td class="points">0</td>
        `;
    tbody.appendChild(row);
  });
});
