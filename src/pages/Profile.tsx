import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/profilePictures/avatar-1295394_1280.webp";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [profileImageSrc, setProfileImageSrc] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      // Set the profile image source
      setProfileImageSrc(user.photoURL || defaultAvatar);
    }
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }
  if (!user) {
    return null;
  }

  // Debug: Log user photoURL
  console.log("User photoURL:", user.photoURL);
  console.log("Default avatar path:", defaultAvatar);

  // Format join date
  const joinDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const lastSignIn = user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "#f8fafc",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Profile Header */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {" "}
            {/* Profile Picture */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e2e8f0",
                border: "2px solid #cbd5e0",
              }}
            >
              {" "}
              <img
                src={profileImageSrc}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onLoad={() => {
                  console.log(
                    "Profile image loaded successfully:",
                    profileImageSrc
                  );
                }}
                onError={() => {
                  console.error(
                    "Profile image failed to load:",
                    profileImageSrc
                  );
                  console.log("Falling back to default avatar:", defaultAvatar);
                  setProfileImageSrc(defaultAvatar);
                }}
              />
            </div>
            {/* User Info */}
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#1a202c",
                  margin: "0 0 0.5rem 0",
                }}
              >
                {user.displayName || "User"}
              </h1>
              <p
                style={{
                  color: "#718096",
                  margin: "0",
                  fontSize: "1.1rem",
                }}
              >
                {user.email}
              </p>
              {user.emailVerified && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#48bb78",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "1rem",
                    fontSize: "0.875rem",
                    marginTop: "0.5rem",
                  }}
                >
                  ✓ Verified Email
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1a202c",
              marginBottom: "1.5rem",
            }}
          >
            Account Information
          </h2>

          <div
            style={{
              display: "grid",
              gap: "1.5rem",
            }}
          >
            {/* User ID */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                User ID
              </label>
              <div
                style={{
                  backgroundColor: "#f7fafc",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  color: "#2d3748",
                }}
              >
                {user.uid}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Email Address
              </label>
              <div
                style={{
                  backgroundColor: "#f7fafc",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                  color: "#2d3748",
                }}
              >
                {user.email}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Display Name
              </label>
              <div
                style={{
                  backgroundColor: "#f7fafc",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                  color: "#2d3748",
                }}
              >
                {user.displayName || "Not set"}
              </div>
            </div>

            {/* Join Date */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Member Since
              </label>
              <div
                style={{
                  backgroundColor: "#f7fafc",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                  color: "#2d3748",
                }}
              >
                {joinDate}
              </div>
            </div>

            {/* Last Sign In */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Last Sign In
              </label>
              <div
                style={{
                  backgroundColor: "#f7fafc",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                  color: "#2d3748",
                }}
              >
                {lastSignIn}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1a202c",
              marginBottom: "1.5rem",
            }}
          >
            Quick Stats
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                backgroundColor: "#edf2f7",
                borderRadius: "0.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#3182ce",
                }}
              >
                Coming Soon
              </div>
              <div
                style={{
                  color: "#4a5568",
                  marginTop: "0.5rem",
                }}
              >
                Posts Created
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                backgroundColor: "#edf2f7",
                borderRadius: "0.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#38a169",
                }}
              >
                Coming Soon
              </div>
              <div
                style={{
                  color: "#4a5568",
                  marginTop: "0.5rem",
                }}
              >
                Likes Given
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                backgroundColor: "#edf2f7",
                borderRadius: "0.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#805ad5",
                }}
              >
                Coming Soon
              </div>
              <div
                style={{
                  color: "#4a5568",
                  marginTop: "0.5rem",
                }}
              >
                Comments Made
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
