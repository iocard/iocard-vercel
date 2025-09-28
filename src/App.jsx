import React from "react";
import Button from "./components/Button";

export default function App() {
  const copyAlias = () => {
    navigator.clipboard.writeText("@MiAlias123");
    alert("Alias copiado al portapapeles ✅");
  };

  return (
    <div className="container">
      <h1 className="title">🌐 ioCARD</h1>
      <p className="subtitle">Tu tarjeta digital personalizada</p>

      <div className="buttons">
        <Button text="Copiar Alias" onClick={copyAlias} color="#007bff" />
        <Button
          text="Google Reseñas"
          link="https://g.page/r/CodigoReseñaGoogle"
          color="#28a745"
        />
        <Button
          text="Instagram"
          link="https://instagram.com/usuario"
          color="#e1306c"
        />
        <Button
          text="LinkedIn"
          link="https://linkedin.com/in/usuario"
          color="#0a66c2"
        />
        <Button
          text="Descargar VCF"
          link="/contacto.vcf"
          color="#6c757d"
        />
      </div>
    </div>
  );
}