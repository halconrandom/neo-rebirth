import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqxgrimzt/image/upload";
const CLOUDINARY_PRESET = "CharacterUpload";

export default function UploadCharacterAvatar({ characterId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setMsg("");
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;

    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET); //

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.secure_url) throw new Error("Upload failed");

      const imageUrl = data.secure_url;
      const fichaRef = doc(db, "users", auth.currentUser.uid, "fichas", characterId);
      await updateDoc(fichaRef, { avatarURL: imageUrl });

      if (onUploadSuccess) onUploadSuccess(imageUrl);
      setPreviewUrl("");
      setFile(null);
      setMsg("✅ Imagen actualizada");
    } catch (err) {
      console.error("Upload error:", err);
      setMsg("❌ Error al subir la imagen.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl("");
    setMsg("");
  };

  return (
    <div className="text-center">
      {!file && (
        <>
          <input
            id={`fileUpload-${characterId}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor={`fileUpload-${characterId}`}
            className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs cursor-pointer"
          >
            Elegir imagen
          </label>
        </>
      )}

      {file && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <img
            src={previewUrl}
            alt="preview"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div className="flex gap-2 text-xs">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-2 py-1 bg-orange-500 rounded hover:bg-orange-400 disabled:opacity-50"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {msg && <p className="mt-2 text-xs">{msg}</p>}
    </div>
  );
}
