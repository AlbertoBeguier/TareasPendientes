export const BordesAnimadosSVG = ({ width, height }) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    style={{ position: "absolute", top: 0, left: 0 }}
  >
    <rect
      x="1"
      y="1"
      width={width - 2} // Ajusta para el strokeWidth
      height={height - 2} // Ajusta para el strokeWidth
      fill="none"
      stroke="orangered"
      strokeWidth="2"
      rx="10" // Bordes redondeados
      ry="10" // Bordes redondeados
    >
      <animate
        attributeName="strokeDasharray"
        from="0, 1020" // Ajusta este valor basado en la suma del ancho y alto del rectángulo
        to="1020, 0" // Igual que el valor `from`
        dur="5s"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
);
