import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
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
  const { setUserData } = useAuth();
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

    const cleanedData = JSON.parse(JSON.stringify(formData));

    if (cleanedData.address?.pincode) {
      cleanedData.address.pincode = Number(cleanedData.address.pincode);
    }

    const removeEmptyFields = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (
          obj[key] === "" ||
          obj[key] === null ||
          (Array.isArray(obj[key]) && obj[key].length === 0) ||
          (typeof obj[key] === "object" && obj[key] !== null && Object.keys(obj[key]).length === 0)
        ) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          removeEmptyFields(obj[key]);
        }
      });
    };

    removeEmptyFields(cleanedData);

    try {
      const { data } = await axios.post(endpoint, cleanedData);

      if (data.success) {
        setUserData(data.data);
        toast.success("Registration successful!");
        if (role === "customer") {
          navigate("/");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const currentStepName = steps[stepIndex];
  const StepComponent = stepComponents[currentStepName];
  const containerClass = stepIndex === 0 ? "max-w-6xl" : "max-w-3xl";

  return (
    <div className={`${containerClass} mx-auto p-6`}>
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