import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqxgrimzt/image/upload";
const CLOUDINARY_PRESET = "Upload_Avatar";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.secure_url;

      // Guarda en Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        avatarURL: imageUrl,
      });

      setMsg("✅ Avatar subido correctamente");
    } catch (err) {
      console.error(err);
      setMsg("❌ Hubo un error al subir el avatar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 text-center">
  {previewUrl && (
    <img
      src={previewUrl}
      alt="Preview"
      className="w-32 h-32 object-cover rounded-full border mx-auto mb-4"
    />
  )}

  {/* Campo de selección de archivo oculto */}
  <div className="mb-4">
    <input
      id="fileUpload"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
    <label
      htmlFor="fileUpload"
      className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
    >
      Elegir imagen
    </label>
  </div>
  {msg && <p className="mt-2 text-sm">{msg}</p>}
</div>
  );
}
