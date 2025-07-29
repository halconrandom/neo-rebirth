import { useState } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqxgrimzt/image/upload";
  const CLOUDINARY_PRESET = "foro_avatar"; // Configura esto en Cloudinary

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = res.data.secure_url;

      // Guardar en Firestore
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          avatarUrl: imageUrl,
        });
        alert("¡Foto actualizada!");
      }
    } catch (err) {
      setError("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center my-6">
      <h3 className="mb-2 font-semibold">Sube tu foto de perfil</h3>
      <input type="file" onChange={handleChange} className="mb-4" />
      {preview && <img src={preview} alt="preview" className="w-32 h-32 mx-auto rounded-full object-cover mb-2" />}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
      >
        {uploading ? "Subiendo..." : "Subir Imagen"}
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}