const Review = ({ formData, onSubmit, goToStep }) => {
    const handleSubmit = () => {
        onSubmit();
    };

    // Helper to display data nicely
    const renderField = (label, value) => (
        <div className="flex justify-between py-1 border-b">
            <span className="font-medium">{label}:</span>
            <span>{Array.isArray(value) ? value.join(", ") : value || "—"}</span>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Review Your Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {Object.entries(formData).map(([key, val]) => {
                    // Skip confirmPassword completely
                    if (key === "confirmPassword") return null;

                    if (val && typeof val === "object" && !Array.isArray(val)) {
                        // For nested objects like address, socialLinks, etc.
                        return (
                            <div key={key}>
                                <h3 className="font-semibold mt-2 capitalize">{key}</h3>
                                {Object.entries(val).map(([subKey, subVal]) => (
                                    <div key={`${key}-${subKey}`} className="ml-4">
                                        {renderField(subKey, subVal)}
                                    </div>
                                ))}
                            </div>
                        );
                    } else {
                        return (
                            <div key={key}>
                                {renderField(key, val)}
                            </div>
                        );
                    }
                })}
            </div>
            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={() => goToStep(3)} // go to previous step (roleDetails)
                    className="text-primary hover:underline"
                >
                    Back to edit
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Review;
