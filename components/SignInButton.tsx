// components/SignInButton.jsx
import { useNavigate } from 'react-router-dom';

function SignInButton() {
  const navigate = useNavigate();

  return (
    <button
      className="sign-in-btn"
      onClick={() => navigate("/login")}
    >
      Sign In
    </button>
  );
}

export default SignInButton;