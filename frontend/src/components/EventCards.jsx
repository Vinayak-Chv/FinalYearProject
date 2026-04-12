import { useNavigate } from "react-router-dom";
import { events } from "../config/Events";

const EventCards = () => {
    const navigate = useNavigate();

    // Descriptions mapped by event id
    const descriptions = {
        wedding: "Bridal lehengas, sherwanis & grand ethnic wear",
        engagement: "Elegant semi‑bridal & festive outfits",
        salwar: "Comfortable yet stylish daily wear",
        reception: "Glamorous gowns, designer lehengas & party wear",
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
                Shop by Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => navigate(`/collection/event/${event.id}`)}
                        className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                        <div className="text-5xl mb-3">{event.icon}</div>
                        <h3 className="text-xl font-bold text-text-primary">{event.title}</h3>
                        <p className="text-text-secondary text-sm mt-2">
                            {descriptions[event.id]}
                        </p>
                        <div className="mt-4 text-primary font-semibold">Explore →</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventCards;