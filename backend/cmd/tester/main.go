package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"time"
)

const baseURL = "http://localhost:8080/api/v1"

var authToken string
var studentID uint
var catatanID uint
var failedCount int

// Colors
const (
	ColorReset  = "\033[0m"
	ColorRed    = "\033[31m"
	ColorGreen  = "\033[32m"
	ColorYellow = "\033[33m"
	ColorCyan   = "\033[36m"
)

func main() {
	log.SetFlags(0)
	fmt.Println(ColorCyan + "================================================" + ColorReset)
	fmt.Println(ColorCyan + "   ULTIMATE API INTEGRATION TESTER (FULL)       " + ColorReset)
	fmt.Println(ColorCyan + "================================================" + ColorReset)
	fmt.Println("Target: " + baseURL)
	fmt.Println("")

	// === Phase 1: Authentication ===
	printHeader("PHASE 1: AUTHENTICATION")
	runTest("1. Login Admin", login)
	runTest("2. Register New User", register)

	if authToken == "" {
		log.Fatal(ColorRed + "Critical: Login failed. Aborting." + ColorReset)
	}

	// === Phase 2: Master Data (Student CRUD) ===
	printHeader("PHASE 2: STUDENT MANAGEMENT (CRUD)")
	runTest("1. Create Student", createStudent)
	runTest("2. Get Student List", getStudents)
	runTest("3. Get Student Detail", getStudentDetail)
	runTest("4. Update Student Profile", updateStudent)
	runTest("5. Upload Student Photo", uploadPhoto)

	if studentID == 0 {
		log.Fatal(ColorRed + "Critical: Student creation failed. Aborting." + ColorReset)
	}

	// === Phase 3: Detailed Data (Sub-resources) ===
	printHeader("PHASE 3: DETAILED DATA")
	runTest("1. Add/Update Parent (Orang Tua)", addParent)
	runTest("2. Add/Update Guardian (Wali)", addGuardian)
	runTest("3. Add/Update Health (Kesehatan)", addHealth)
	runTest("4. Add Education History (Pendidikan)", addEducation)
	runTest("5. Add Personality Record (Kepribadian)", addPersonality)
	runTest("6. Add Achievement (Prestasi)", addAchievement)
	runTest("7. Add Scholarship (Beasiswa)", addScholarship)

	// === Phase 4: Academic (Nilai & Rapor) ===
	printHeader("PHASE 4: ACADEMIC & GRADES")
	runTest("1. Get Subjects (Mata Pelajaran)", getSubjects)
	runTest("2. Input Semester Grade (Single)", inputGradeSingle)
	runTest("3. Input Semester Grade (Batch)", inputGradeBatch)
	runTest("4. Get Semester Grades (Rapor)", getGrades)
	runTest("5. Input Certificate Grade (Nilai Ijazah)", inputIjazah)
	runTest("6. Get Certificate Grades", getIjazah)
	runTest("7. Get Attendance (Kehadiran)", getAttendance)

	// === Phase 5: Semester Notes & Activities ===
	printHeader("PHASE 5: NOTES & ACTIVITIES")
	runTest("1. Create Semester Notes (Catatan)", createSemesterNotes)
	if catatanID > 0 {
		runTest("2. Add Internship (PKL)", addPKL)
		runTest("3. Add Extracurricular (Ekskul)", addEkskul)
	}

	// === Phase 6: Student Exit ===
	printHeader("PHASE 6: STUDENT EXIT")
	runTest("1. Add Leaving Record (Meninggalkan Sekolah)", addLeavingRecord)

	// === Phase 7: Cleanup (Optional - Delete Test Data) ===
	printHeader("PHASE 7: DATA CLEANUP")
	// runTest("1. Delete Student", deleteStudent) // Uncomment to test deletion

	fmt.Println("")
	if failedCount == 0 {
		fmt.Println(ColorGreen + "ALL TESTS COMPLETED SUCCESSFULLY!" + ColorReset)
	} else {
		fmt.Printf("%sTEST COMPLETED WITH %d FAILURES%s\n", ColorRed, failedCount, ColorReset)
		os.Exit(1)
	}
}

// ... Implementations ...

func login() error {
	req := map[string]string{"username": "admin", "password": "admin123"}
	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Token string `json:"token"`
		} `json:"data"`
	}
	if err := sendRequest("POST", "/auth/login", req, &resp); err != nil {
		return err
	}
	authToken = resp.Data.Token
	return nil
}

func register() error {
	username := fmt.Sprintf("user_%d", time.Now().Unix())
	req := map[string]string{
		"username": username,
		"email":    username + "@example.com",
		"password": "password123",
	}
	return sendRequest("POST", "/auth/register", req, nil)
}

func createStudent() error {
	req := map[string]interface{}{
		"no_induk":       fmt.Sprintf("%d", time.Now().Unix()),
		"nisn":           fmt.Sprintf("%d", time.Now().Unix())[0:10],
		"nama_lengkap":   "Siswa Test Lengkap",
		"jenis_kelamin":  "L",
		"tempat_lahir":   "Bandung",
		"tanggal_lahir":  "2009-01-01",
		"agama":          "Islam",
		"anak_ke":        1,
		"jumlah_saudara": 2,
	}
	var resp struct {
		Data struct {
			ID uint `json:"id"`
		} `json:"data"`
	}
	if err := sendRequest("POST", "/siswa", req, &resp); err != nil {
		return err
	}
	studentID = resp.Data.ID
	return nil
}

func getStudents() error { return sendRequest("GET", "/siswa?page=1&page_size=5", nil, nil) }

func getStudentDetail() error {
	return sendRequest("GET", fmt.Sprintf("/siswa/%d", studentID), nil, nil)
}

func updateStudent() error {
	req := map[string]interface{}{
		"nama_lengkap": "Siswa Test Update",
		"alamat":       "Jl. Update No. 1",
	}
	return sendRequest("PUT", fmt.Sprintf("/siswa/%d", studentID), req, nil)
}

func uploadPhoto() error {
	// Create a dummy file with JPEG magic bytes (FF D8 FF)
	fileContent := []byte{0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01}

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)

	// Create part with explicitly set Content-Type
	// We use CreatePart to set custom headers
	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", fmt.Sprintf(`form-data; name="foto"; filename="test.jpg"`))
	h.Set("Content-Type", "image/jpeg")

	part, err := writer.CreatePart(h)
	if err != nil {
		return err
	}
	part.Write(fileContent)
	writer.Close()

	req, _ := http.NewRequest("POST", fmt.Sprintf("%s/siswa/%d/foto", baseURL, studentID), body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", authToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("status %d: %s", resp.StatusCode, string(respBody))
	}
	return nil
}

func addParent() error {
	req := map[string]interface{}{
		"tipe": "ayah", "nama": "Ayah Budi", "pekerjaan": "PNS", "no_telepon": "08123456",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/orang-tua", studentID), req, nil)
}

func addGuardian() error {
	req := map[string]interface{}{
		"nama": "Paman Budi", "jenis_kelamin": "L", "hubungan_dengan_siswa": "Paman",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/wali", studentID), req, nil)
}

func addHealth() error {
	req := map[string]interface{}{
		"golongan_darah": "A", "berat_badan_masuk": 50, "tinggi_badan_masuk": 160,
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/kesehatan", studentID), req, nil)
}

func addEducation() error {
	req := map[string]interface{}{
		"tipe": "siswa_baru", "tanggal_diterima": "2024-07-01", "asal_sekolah": "SMP 1", "kelas_diterima": "X",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/pendidikan", studentID), req, nil)
}

func addPersonality() error {
	req := map[string]interface{}{
		"aspek": "Kelakuan", "nilai": "Baik", "tahun_pelajaran": "2024/2025",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/kepribadian", studentID), req, nil)
}

func addAchievement() error {
	req := map[string]interface{}{
		"bidang": "Olahraga", "keterangan": "Juara 1", "tahun": 2024, "tingkat": "Kota",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/prestasi", studentID), req, nil)
}

func addScholarship() error {
	req := map[string]interface{}{
		"tahun_pelajaran": "2024/2025", "pemberi": "Pemerintah", "keterangan": "KIP",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/beasiswa", studentID), req, nil)
}

func getSubjects() error { return sendRequest("GET", "/mata-pelajaran", nil, nil) }

func inputGradeSingle() error {
	req := map[string]interface{}{
		"mata_pelajaran_id": 1, "kelas": "X", "semester": 1, "tahun_pelajaran": "2024/2025",
		"nilai_pengetahuan": 80, "predikat_pengetahuan": "B",
		"nilai_keterampilan": 80, "predikat_keterampilan": "B",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/nilai-semester", studentID), req, nil)
}

func inputGradeBatch() error {
	req := map[string]interface{}{
		"nilai": []map[string]interface{}{
			{
				"mata_pelajaran_id": 1, "kelas": "X", "semester": 2, "tahun_pelajaran": "2024/2025",
				"nilai_pengetahuan": 90, "predikat_pengetahuan": "A",
				"nilai_keterampilan": 90, "predikat_keterampilan": "A",
			},
		},
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/nilai-semester/batch", studentID), req, nil)
}

func getGrades() error {
	return sendRequest("GET", fmt.Sprintf("/siswa/%d/nilai-semester?kelas=X", studentID), nil, nil)
}

func inputIjazah() error {
	req := map[string]interface{}{
		"mata_pelajaran_id": 1, "nilai_akhir": 88, "tahun_lulus": "2027",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/nilai-ijazah", studentID), req, nil)
}

func getIjazah() error {
	return sendRequest("GET", fmt.Sprintf("/siswa/%d/nilai-ijazah", studentID), nil, nil)
}

func getAttendance() error {
	return sendRequest("GET", fmt.Sprintf("/siswa/%d/kehadiran", studentID), nil, nil)
}

func createSemesterNotes() error {
	req := map[string]interface{}{"kelas": "X", "semester": 2}
	var resp struct {
		Data struct {
			ID uint `json:"id"`
		} `json:"data"`
	}
	if err := sendRequest("POST", fmt.Sprintf("/siswa/%d/catatan-semester", studentID), req, &resp); err != nil {
		return err
	}
	catatanID = resp.Data.ID
	return nil
}

func addPKL() error {
	req := map[string]interface{}{"nama_dudi": "Tech Corp", "lama_bulan": 3}
	return sendRequest("POST", fmt.Sprintf("/catatan-semester/%d/pkl", catatanID), req, nil)
}

func addEkskul() error {
	req := map[string]interface{}{"nama_kegiatan": "Basket", "keterangan": "Anggota"}
	return sendRequest("POST", fmt.Sprintf("/catatan-semester/%d/ekstrakurikuler", catatanID), req, nil)
}

func addLeavingRecord() error {
	req := map[string]interface{}{
		"tipe": "pindah", "tanggal": "2025-06-20", "sekolah_tujuan": "SMA Lain", "alasan": "Pindah Rumah",
	}
	return sendRequest("POST", fmt.Sprintf("/siswa/%d/meninggalkan-sekolah", studentID), req, nil)
}

// --- Helpers ---
func printHeader(text string) {
	fmt.Println("\n" + ColorYellow + text + ColorReset)
	fmt.Println(ColorYellow + "--------------------------------" + ColorReset)
}

func runTest(name string, testFunc func() error) {
	fmt.Printf("%-50s ... ", name)
	start := time.Now()
	err := testFunc()
	duration := time.Since(start)
	if err != nil {
		fmt.Printf("%sFAILED%s (%v)\n", ColorRed, ColorReset, duration)
		fmt.Printf("  %sError: %v%s\n", ColorRed, err, ColorReset)
		failedCount++
	} else {
		fmt.Printf("%sPASSED%s (%v)\n", ColorGreen, ColorReset, duration)
	}
	time.Sleep(200 * time.Millisecond)
}

func sendRequest(method, endpoint string, body interface{}, target interface{}) error {
	var bodyReader io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("marshal error: %v", err)
		}
		bodyReader = bytes.NewBuffer(jsonBody)
	}
	req, err := http.NewRequest(method, baseURL+endpoint, bodyReader)
	if err != nil {
		return fmt.Errorf("req error: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	if authToken != "" {
		req.Header.Set("Authorization", authToken)
	}
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("net error: %v", err)
	}
	defer resp.Body.Close()
	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return fmt.Errorf("status %d: %s", resp.StatusCode, string(respBody))
	}
	if target != nil {
		return json.Unmarshal(respBody, target)
	}
	return nil
}
