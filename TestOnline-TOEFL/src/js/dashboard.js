document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const profilePic = document.getElementById("profilePic");
  const riwayatTable = document.getElementById("riwayatTable");

  // Dummy user data
  const userData = {
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@example.com",
    photo: "../img/default.jpg" // bisa ganti path sesuai lokasi gambar default
  };

  // Dummy test history
  const testHistory = [
    { tanggal: "2025-06-01", listening: 24, structure: 23, reading: 25 },
    { tanggal: "2025-06-05", listening: 22, structure: 21, reading: 23 },
    { tanggal: "2025-06-09", listening: 26, structure: 24, reading: 27 }
  ];

  // Tampilkan data user
  userName.textContent = userData.name;
  userEmail.textContent = userData.email;
  profilePic.src = userData.photo;

  // Tampilkan riwayat tes
  testHistory.forEach((test) => {
    const total = test.listening + test.structure + test.reading;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${test.tanggal}</td>
      <td>${test.listening}</td>
      <td>${test.structure}</td>
      <td>${test.reading}</td>
      <td><strong>${total}</strong></td>
    `;
    riwayatTable.appendChild(row);
  });
});

// Fitur edit nama dan email
function editProfile() {
  const newName = prompt("Masukkan nama baru:");
  const newEmail = prompt("Masukkan email baru:");

  if (newName) document.getElementById("userName").textContent = newName;
  if (newEmail) document.getElementById("userEmail").textContent = newEmail;

  alert("Profil berhasil diperbarui!");
}

// Fitur update foto profil
function updateProfilePic() {
  const fileInput = document.getElementById("uploadFoto");
  const profilePic = document.getElementById("profilePic");

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePic.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Fitur cetak sertifikat
function cetakSertifikat() {
  const nama = document.getElementById("userName").textContent;
  const email = document.getElementById("userEmail").textContent;
  const foto = document.getElementById("profilePic").src;

  const rows = document.querySelectorAll("#riwayatTable tr");
  let skorTerakhir = 0;

  if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    skorTerakhir = lastRow.lastElementChild.textContent;
  }

  const tanggal = new Date().toLocaleDateString();

  const newWindow = window.open("", "_blank", "width=800,height=600");
  // Pastikan gambar sudah dimuat sebelum print
  newWindow.document.write(`
    <html>
      <head>
        <title>Sertifikat TOEFL</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 2rem;
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          h2 {
            font-size: 2rem;
          }
          img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 50%;
            border: 2px solid #000;
            margin-bottom: 1rem;
          }
          .garis {
            border-top: 2px solid #000;
            margin: 2rem 0;
          }
        </style>
      </head>
      <body>
        <h1>SERTIFIKAT TOEFL</h1>
        <img id="sertifikatFoto" src="${foto}" alt="Foto Profil" />
        <p>Dengan ini menyatakan bahwa:</p>
        <h2>${nama}</h2>
        <p>Email: ${email}</p>
        <p>Telah mengikuti simulasi TOEFL dan memperoleh total skor:</p>
        <h1>${skorTerakhir}</h1>
        <div class="garis"></div>
        <p>Tanggal Cetak: ${tanggal}</p>
        <p style="margin-top: 3rem;">&copy; 2025 Simulasi TOEFL</p>
        <script>
          // Tunggu gambar selesai dimuat sebelum print
          const img = document.getElementById('sertifikatFoto');
          if (img.complete) {
            window.print();
          } else {
            img.onload = () => window.print();
          }
        </script>
      </body>
    </html>
  `);
  newWindow.document.close();
}
