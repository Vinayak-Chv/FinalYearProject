import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import RoleSelection from "../components/steps/RoleSelection";
import Credentials from "../components/steps/Credentials";
import BasicInfo from "../components/steps/BasicInfo";
import CustomerDetails from "../components/steps/CustomerDetails";
import TailorDetails from "../components/steps/TailorDetails";
import DesignerDetails from "../components/steps/DesignerDetails";
import Review from "../components/steps/Review";

const steps = ["role", "credentials", "basic", "roleDetails", "review"];
const stepComponents = {
  role: RoleSelection,
  credentials: Credentials,
  basic: BasicInfo,
  roleDetails: ({ role, formData, updateFormData, onNext, onPrev, goToStep }) => {
    if (role === "customer") return <CustomerDetails {...{ formData, updateFormData, onNext, onPrev }} />;
    if (role === "tailor") return <TailorDetails {...{ formData, updateFormData, onNext, onPrev }} />;
    if (role === "designer") return <DesignerDetails {...{ formData, updateFormData, onNext, onPrev }} />;
    return null;
  },
  review: Review,
};

const Register = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({});

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const goToNextStep = () => setStepIndex(prev => prev + 1);
  const goToPrevStep = () => setStepIndex(prev => prev - 1);
  const goToStep = (index) => setStepIndex(index);

  const submitRegistration = async () => {
    const endpoint = `http://localhost:3000/api/auth/register/${role}`;
    try {
      const { data } = await axios.post(endpoint, formData);

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };


  const currentStepName = steps[stepIndex];
  const StepComponent = stepComponents[currentStepName];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <StepComponent
        role={role}
        setRole={setRole}
        formData={formData}
        updateFormData={updateFormData}
        onNext={goToNextStep}
        onPrev={goToPrevStep}
        goToStep={goToStep}
        onSubmit={submitRegistration}
      />
    </div>
  );
};

export default Register;