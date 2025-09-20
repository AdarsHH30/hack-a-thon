"use client";

import SimpleCard3D from "@/components/SimpleCard3D";

export default function TestCard3D() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem" }}>
            3D Card Test
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Hover over the cards below to see the 3D rotation effect
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          
          <SimpleCard3D>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                width: "4rem", 
                height: "4rem", 
                backgroundColor: "#3b82f6", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                margin: "0 auto 1rem auto" 
              }}>
                <span style={{ fontSize: "1.5rem", color: "white" }}>🚀</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
                Card 1
              </h3>
              <p style={{ color: "#6b7280" }}>
                This card has 3D hover effects. Try hovering over it!
              </p>
            </div>
          </SimpleCard3D>

          <SimpleCard3D>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                width: "4rem", 
                height: "4rem", 
                backgroundColor: "#10b981", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                margin: "0 auto 1rem auto" 
              }}>
                <span style={{ fontSize: "1.5rem", color: "white" }}>✨</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
                Card 2
              </h3>
              <p style={{ color: "#6b7280" }}>
                Smooth animations with Framer Motion!
              </p>
            </div>
          </SimpleCard3D>

          <SimpleCard3D>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                width: "4rem", 
                height: "4rem", 
                backgroundColor: "#8b5cf6", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                margin: "0 auto 1rem auto" 
              }}>
                <span style={{ fontSize: "1.5rem", color: "white" }}>🎯</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
                Card 3
              </h3>
              <p style={{ color: "#6b7280" }}>
                3D rotation with scaling effects!
              </p>
            </div>
          </SimpleCard3D>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: "2rem", 
          borderRadius: "0.5rem", 
          border: "1px solid #e5e7eb" 
        }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>
            How to use:
          </h3>
          <div style={{ color: "#6b7280", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "0.5rem" }}>
              • Import the SimpleCard3D component
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              • Wrap your content inside {'<SimpleCard3D>'}
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              • The component will automatically add 3D hover effects
            </p>
            <p>
              • Uses Framer Motion for smooth animations
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}