import { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function SigninWithGoogle() {
  const [user, setUser] = useState<any>(null);

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      console.log("ID Token:", credentialResponse.credential);

      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Decoded Token:", decoded);

      setUser(decoded);
    } else {
      console.error("No credential returned");
    }
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    console.log("User logged out");
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      )}
    </div>
  );
}
