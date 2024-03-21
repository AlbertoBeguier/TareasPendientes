import "../styles/Footer.css";

export function Footer() {
  return (
    <>
      <div className="footer-container">
        <br />
        <hr className="lineaHorizontal-footer" />
        <div className="parrafo-footer">
          © Todos los derechos reservados - A<sup>2</sup>B Systems
        </div>
        <img
          className="img-footer"
          style={{ width: "45px" }}
          src="/EstudioIcono64x64.png"
          alt="estudio"
        />
        <div className="parrafo-footer">Estudio Beguier</div>
        <hr className="lineaHorizontal-footer" />
      </div>
    </>
  );
}
