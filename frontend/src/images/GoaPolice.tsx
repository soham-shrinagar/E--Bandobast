import GoaPoliceEmblem from "../assets/GoaPoliceEmblem.png";

export default function GoaPolice() {
  return (
    <div>
      <img
        src={GoaPoliceEmblem}
        alt="Goa Police Emblem"
        className="w-[350px] h-[120px] transition-transform duration-200 hover:-translate-y-2 active:translate-y-2"
      />
    </div>
  );
}
