"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Package } from "lucide-react";

export default function DeliveryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isNight, setIsNight] = useState(false);
  const [speed, setSpeed] = useState(2); // Speed multiplier: 1x, 2x, 3x
  const [statusText, setStatusText] = useState("Đang tải...");
  const [currentStage, setCurrentStage] = useState<"loading" | "transit" | "unloading" | "returning">("loading");

  // Keep speed and isNight in refs so the animation loop can read the latest values without re-binding useEffect
  const speedRef = useRef(speed);
  const isNightRef = useRef(isNight);
  
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    isNightRef.current = isNight;
  }, [isNight]);

  // Handle manual trigger to restart/force delivery
  const triggerDelivery = () => {
    if (animationStateRef.current) {
      const state = animationStateRef.current;
      state.truckX = 120;
      state.truckState = "loading";
      state.stateTimer = 0;
      state.truckDirection = 1;
      state.unloadedCount = 0;
      state.loadedCount = 0;
      
      // Reset appliance positions
      state.appliances.forEach((app, idx) => {
        app.x = 40;
        app.y = 260 - idx * 25;
        app.opacity = 0;
        app.scale = 0.5;
        app.stage = "warehouse"; // warehouse, loading, in_truck, unloading, house
      });
      setCurrentStage("loading");
    }
  };

  // State reference for the canvas loop
  const animationStateRef = useRef<{
    truckX: number;
    truckY: number;
    truckDirection: number; // 1: left to right, -1: right to left
    truckState: "loading" | "transit" | "unloading" | "returning";
    stateTimer: number;
    wheelsRotation: number;
    clouds: Array<{ x: number; y: number; speed: number; size: number }>;
    snowflakes: Array<{ x: number; y: number; speedY: number; speedX: number; r: number }>;
    smokePuffs: Array<{ x: number; y: number; size: number; opacity: number }>;
    appliances: Array<{
      id: number;
      type: "ac" | "fridge" | "washer";
      name: string;
      color: string;
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      opacity: number;
      scale: number;
      stage: "warehouse" | "loading" | "in_truck" | "unloading" | "house";
    }>;
    loadedCount: number;
    unloadedCount: number;
    emoticons: Array<{ x: number; y: number; text: string; opacity: number; vy: number }>;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize animation state if not already initialized
    if (!animationStateRef.current) {
      // Create clouds
      const clouds = Array.from({ length: 5 }, (_, i) => ({
        x: Math.random() * 800,
        y: 30 + Math.random() * 80,
        speed: 0.1 + Math.random() * 0.2,
        size: 25 + Math.random() * 20,
      }));

      // Create falling ice/snow particles
      const snowflakes = Array.from({ length: 25 }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 400,
        speedY: 0.5 + Math.random() * 1.2,
        speedX: -0.3 + Math.random() * 0.6,
        r: 1 + Math.random() * 2.5,
      }));

      // Create appliances
      const appliances = [
        { id: 1, type: "ac" as const, name: "Máy Lạnh Inverter", color: "#0a84ff", x: 40, y: 260, targetX: 120, targetY: 275, opacity: 0, scale: 0.5, stage: "warehouse" as const },
        { id: 2, type: "fridge" as const, name: "Tủ Lạnh Panasonic", color: "#334155", x: 40, y: 235, targetX: 120, targetY: 275, opacity: 0, scale: 0.5, stage: "warehouse" as const },
        { id: 3, type: "washer" as const, name: "Máy Giặt LG Lồng Ngang", color: "#10b981", x: 40, y: 210, targetX: 120, targetY: 275, opacity: 0, scale: 0.5, stage: "warehouse" as const },
      ];

      animationStateRef.current = {
        truckX: 120,
        truckY: 285,
        truckDirection: 1,
        truckState: "loading",
        stateTimer: 0,
        wheelsRotation: 0,
        clouds,
        snowflakes,
        smokePuffs: [],
        appliances,
        loadedCount: 0,
        unloadedCount: 0,
        emoticons: [],
      };
    }

    const state = animationStateRef.current;
    let animationId: number;

    // Helper functions for drawing
    const drawSkyline = (c: CanvasRenderingContext2D, isNightMode: boolean) => {
      // Draw background gradient
      const skyGrad = c.createLinearGradient(0, 0, 0, 300);
      if (isNightMode) {
        skyGrad.addColorStop(0, "#0b132b");
        skyGrad.addColorStop(1, "#1c2541");
      } else {
        skyGrad.addColorStop(0, "#e0f2fe");
        skyGrad.addColorStop(1, "#f0f9ff");
      }
      c.fillStyle = skyGrad;
      c.fillRect(0, 0, 800, 350);

      // Draw distant hills or skyscrapers
      c.fillStyle = isNightMode ? "#1c2333" : "#cbd5e1";
      
      // Landmark 81 silhouette in the distance
      c.beginPath();
      c.moveTo(380, 320);
      c.lineTo(380, 220);
      c.lineTo(390, 220);
      c.lineTo(390, 180);
      c.lineTo(395, 180);
      c.lineTo(395, 120); // Spire base
      c.lineTo(399, 120);
      c.lineTo(400, 70); // Spire tip
      c.lineTo(401, 120);
      c.lineTo(405, 120);
      c.lineTo(405, 180);
      c.lineTo(410, 180);
      c.lineTo(410, 220);
      c.lineTo(420, 220);
      c.lineTo(420, 320);
      c.fill();

      // Distant buildings
      c.fillStyle = isNightMode ? "#1e293b" : "#cbd5e1";
      const bldgs = [
        { x: 180, w: 40, h: 100 },
        { x: 230, w: 35, h: 130 },
        { x: 275, w: 50, h: 80 },
        { x: 440, w: 45, h: 110 },
        { x: 495, w: 40, h: 140 },
        { x: 545, w: 55, h: 90 },
      ];
      bldgs.forEach(b => {
        c.fillRect(b.x, 320 - b.h, b.w, b.h);
        
        // Draw glowing yellow windows if night mode
        if (isNightMode) {
          c.fillStyle = "rgba(253, 224, 71, 0.4)";
          for (let wy = 320 - b.h + 10; wy < 310; wy += 20) {
            for (let wx = b.x + 5; wx < b.x + b.w - 5; wx += 12) {
              if (Math.random() > 0.3) {
                c.fillRect(wx, wy, 5, 8);
              }
            }
          }
          c.fillStyle = "#1e293b"; // Reset to building color
        }
      });

      // Skyline outline silhouette (midground)
      c.fillStyle = isNightMode ? "#111827" : "#94a3b8";
      c.beginPath();
      c.moveTo(0, 320);
      c.lineTo(30, 260);
      c.lineTo(60, 260);
      c.lineTo(70, 280);
      c.lineTo(100, 280);
      c.lineTo(120, 240);
      c.lineTo(160, 240);
      c.lineTo(180, 290);
      
      c.lineTo(330, 290);
      c.lineTo(350, 250);
      c.lineTo(375, 250);
      c.lineTo(390, 280);
      
      c.lineTo(600, 280);
      c.lineTo(620, 230);
      c.lineTo(660, 230);
      c.lineTo(690, 270);
      c.lineTo(720, 270);
      c.lineTo(740, 240);
      c.lineTo(770, 240);
      c.lineTo(800, 320);
      c.closePath();
      c.fill();
    };

    const drawClouds = (c: CanvasRenderingContext2D) => {
      c.fillStyle = isNightRef.current ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)";
      state.clouds.forEach(cloud => {
        c.beginPath();
        c.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        c.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
        c.arc(cloud.x + cloud.size * 1.2, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
        c.closePath();
        c.fill();

        // Move cloud
        cloud.x += cloud.speed * speedRef.current;
        if (cloud.x > 850) cloud.x = -100;
      });
    };

    const drawSnow = (c: CanvasRenderingContext2D) => {
      c.fillStyle = isNightRef.current ? "rgba(255, 255, 255, 0.45)" : "rgba(10, 132, 255, 0.2)";
      state.snowflakes.forEach(snow => {
        c.beginPath();
        c.arc(snow.x, snow.y, snow.r, 0, Math.PI * 2);
        c.fill();

        // Move snow particle
        snow.y += snow.speedY * (1 + speedRef.current * 0.2);
        snow.x += snow.speedX;
        if (snow.y > 400) {
          snow.y = -10;
          snow.x = Math.random() * 800;
        }
      });
    };

    const drawWarehouse = (c: CanvasRenderingContext2D, isNightMode: boolean) => {
      // Main structure
      c.fillStyle = isNightMode ? "#1f2937" : "#e2e8f0";
      c.strokeStyle = isNightMode ? "#111827" : "#cbd5e1";
      c.lineWidth = 2;
      c.fillRect(10, 200, 120, 120);
      c.strokeRect(10, 200, 120, 120);

      // Roof
      c.fillStyle = isNightMode ? "#4f46e5" : "#0a84ff";
      c.beginPath();
      c.moveTo(5, 200);
      c.lineTo(70, 160);
      c.lineTo(135, 200);
      c.closePath();
      c.fill();

      // Signage
      c.fillStyle = "#ffffff";
      c.fillRect(25, 205, 90, 20);
      c.strokeStyle = "#0a84ff";
      c.strokeRect(25, 205, 90, 20);
      c.fillStyle = "#1e293b";
      c.font = "bold 9px sans-serif";
      c.textAlign = "center";
      c.fillText("KHO NHẬP HÀNG", 70, 218);

      // Roll door
      c.fillStyle = isNightMode ? "#111827" : "#94a3b8";
      c.fillRect(30, 250, 80, 70);

      // Draw metal segments of roll door
      c.strokeStyle = isNightMode ? "#1e293b" : "#cbd5e1";
      c.lineWidth = 1;
      for (let ry = 255; ry < 320; ry += 8) {
        c.beginPath();
        c.moveTo(30, ry);
        c.lineTo(110, ry);
        c.stroke();
      }

      // Warehouse windows glowing if night
      if (isNightMode) {
        c.fillStyle = "rgba(253, 224, 71, 0.75)";
        c.fillRect(35, 230, 20, 12);
        c.fillRect(85, 230, 20, 12);
      } else {
        c.fillStyle = "#ffffff";
        c.fillRect(35, 230, 20, 12);
        c.fillRect(85, 230, 20, 12);
        c.strokeStyle = "#94a3b8";
        c.strokeRect(35, 230, 20, 12);
        c.strokeRect(85, 230, 20, 12);
      }
    };

    const drawHouse = (c: CanvasRenderingContext2D, isNightMode: boolean) => {
      // Main frame
      c.fillStyle = isNightMode ? "#374151" : "#ffffff";
      c.strokeStyle = isNightMode ? "#1f2937" : "#e2e8f0";
      c.lineWidth = 2;
      c.fillRect(660, 210, 120, 110);
      c.strokeRect(660, 210, 120, 110);

      // Triangle Roof
      c.fillStyle = "#ef4444"; // Red tiles
      c.beginPath();
      c.moveTo(650, 210);
      c.lineTo(720, 160);
      c.lineTo(790, 210);
      c.closePath();
      c.fill();

      // Chimney
      c.fillStyle = "#b91c1c";
      c.fillRect(755, 170, 15, 25);
      // Chimney top
      c.fillStyle = "#7f1d1d";
      c.fillRect(752, 170, 21, 5);

      // Mailbox / Address plate
      c.fillStyle = "#0a84ff";
      c.fillRect(675, 225, 25, 12);
      c.fillStyle = "#ffffff";
      c.font = "bold 7px sans-serif";
      c.textAlign = "center";
      c.fillText("TẬN NHÀ", 687, 233);

      // Wooden door
      c.fillStyle = "#b45309"; // brown
      c.fillRect(705, 260, 30, 60);
      // Doorknob
      c.fillStyle = "#fbbf24";
      c.beginPath();
      c.arc(710, 290, 2, 0, Math.PI * 2);
      c.fill();

      // Glowing Windows
      if (isNightMode) {
        c.fillStyle = "rgba(253, 224, 71, 0.85)"; // warm glow
        c.fillRect(675, 250, 20, 25);
        c.fillRect(745, 250, 20, 25);
        c.shadowColor = "#fde047";
        c.shadowBlur = 10;
        c.fillRect(675, 250, 20, 25);
        c.fillRect(745, 250, 20, 25);
        c.shadowBlur = 0; // Reset
      } else {
        c.fillStyle = "#e2e8f0";
        c.fillRect(675, 250, 20, 25);
        c.fillRect(745, 250, 20, 25);
        c.strokeStyle = "#cbd5e1";
        c.strokeRect(675, 250, 20, 25);
        c.strokeRect(745, 250, 20, 25);
      }
    };

    const drawRoad = (c: CanvasRenderingContext2D, isNightMode: boolean) => {
      // Main road asphalt
      c.fillStyle = isNightMode ? "#111827" : "#475569";
      c.fillRect(0, 320, 800, 80);

      // Top curb highlight
      c.fillStyle = isNightMode ? "#1f2937" : "#64748b";
      c.fillRect(0, 318, 800, 3);

      // Sidewalk grassy area
      c.fillStyle = isNightMode ? "#064e3b" : "#10b981";
      c.fillRect(0, 380, 800, 20);

      // Dash Lane markers scroll effect
      c.strokeStyle = "#ffffff";
      c.lineWidth = 4;
      c.setLineDash([20, 25]);
      
      let offset = 0;
      if (state.truckState === "transit" || state.truckState === "returning") {
        const direction = state.truckState === "transit" ? 1 : -1;
        state.wheelsRotation += 0.1 * speedRef.current * direction;
        offset = -(state.wheelsRotation * 40) % 45;
      }
      
      c.lineDashOffset = offset;
      c.beginPath();
      c.moveTo(0, 350);
      c.lineTo(800, 350);
      c.stroke();
      c.setLineDash([]); // Reset line dash
    };

    const drawAppliance = (c: CanvasRenderingContext2D, type: "ac" | "fridge" | "washer", x: number, y: number, color: string, scale: number) => {
      c.save();
      c.translate(x, y);
      c.scale(scale, scale);
      
      // Shadow
      c.fillStyle = "rgba(0, 0, 0, 0.15)";
      c.fillRect(-15, 12, 30, 4);

      if (type === "ac") {
        // Air Conditioner
        c.fillStyle = "#ffffff";
        c.strokeStyle = "#94a3b8";
        c.lineWidth = 1.5;
        // Rounded body
        c.beginPath();
        c.roundRect(-16, -7, 32, 14, 2);
        c.fill();
        c.stroke();

        // Air vent flap
        c.strokeStyle = "#cbd5e1";
        c.beginPath();
        c.moveTo(-12, 4);
        c.lineTo(12, 4);
        c.stroke();

        // Screen display/Logo
        c.fillStyle = "#60a5fa";
        c.fillRect(8, -2, 4, 3);
      } else if (type === "fridge") {
        // Refrigerator
        c.fillStyle = "#475569";
        c.strokeStyle = "#1e293b";
        c.lineWidth = 1.5;
        c.beginPath();
        c.roundRect(-12, -22, 24, 40, 2);
        c.fill();
        c.stroke();

        // Freezer split line
        c.strokeStyle = "#1e293b";
        c.beginPath();
        c.moveTo(-12, -7);
        c.lineTo(12, -7);
        c.stroke();

        // Handles
        c.fillStyle = "#e2e8f0";
        c.fillRect(8, -17, 2, 8); // Top door handle
        c.fillRect(8, -3, 2, 12);  // Bottom door handle

        // Brand logo sticker
        c.fillStyle = "#3b82f6";
        c.fillRect(-4, -18, 8, 3);
      } else {
        // Washing machine
        c.fillStyle = "#f1f5f9";
        c.strokeStyle = "#475569";
        c.lineWidth = 1.5;
        c.beginPath();
        c.roundRect(-14, -13, 28, 26, 2.5);
        c.fill();
        c.stroke();

        // Drum circle glass door
        c.fillStyle = "rgba(14, 165, 233, 0.25)";
        c.strokeStyle = "#64748b";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(0, 3, 7, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        // Control board panel at top
        c.fillStyle = "#334155";
        c.fillRect(-11, -10, 22, 4);

        // Dial indicator
        c.fillStyle = "#f59e0b";
        c.beginPath();
        c.arc(-6, -8, 1, 0, Math.PI * 2);
        c.fill();
      }

      c.restore();
    };

    const drawTruck = (c: CanvasRenderingContext2D, tx: number, ty: number, dir: number, isNightMode: boolean) => {
      c.save();
      c.translate(tx, ty);
      c.scale(dir, 1); // Flip horizontally depending on direction

      // Exhaust pipe smoke puff generator
      if (state.truckState === "transit" || state.truckState === "returning") {
        if (Math.random() < 0.15) {
          state.smokePuffs.push({
            x: tx - 65 * dir,
            y: ty + 12 + Math.random() * 4,
            size: 4 + Math.random() * 4,
            opacity: 0.8,
          });
        }
      }

      // 1. Headlight beam if Night mode
      if (isNightMode) {
        c.save();
        const beamGrad = c.createRadialGradient(45, 0, 0, 100, 0, 150);
        beamGrad.addColorStop(0, "rgba(253, 224, 71, 0.75)");
        beamGrad.addColorStop(0.3, "rgba(253, 224, 71, 0.25)");
        beamGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
        c.fillStyle = beamGrad;
        c.beginPath();
        c.moveTo(40, -5);
        c.lineTo(200, -70);
        c.lineTo(200, 70);
        c.closePath();
        c.fill();
        c.restore();
      }

      // 2. Cabin (Front of truck)
      c.fillStyle = "#0056b3"; // Primary Dark Blue
      c.beginPath();
      c.roundRect(15, -15, 30, 30, [0, 8, 4, 0]);
      c.fill();

      // Front bumper/grill
      c.fillStyle = "#94a3b8";
      c.fillRect(40, 5, 8, 8);

      // Cabin window
      c.fillStyle = isNightMode ? "#fef08a" : "#e2f1ff";
      c.beginPath();
      c.moveTo(25, -12);
      c.lineTo(38, -12);
      c.lineTo(38, 2);
      c.lineTo(25, 2);
      c.closePath();
      c.fill();

      // Headlight lamp itself
      c.fillStyle = isNightMode ? "#fef08a" : "#ffffff";
      c.fillRect(43, -2, 3, 4);

      // 3. Truck Chassis (Connecting bridge)
      c.fillStyle = "#1e293b";
      c.fillRect(-20, 10, 40, 6);

      // 4. Large Container Body (White cargo back)
      c.fillStyle = "#ffffff";
      c.strokeStyle = "#cbd5e1";
      c.lineWidth = 1.5;
      c.beginPath();
      c.roundRect(-60, -32, 75, 43, 4);
      c.fill();
      c.stroke();

      // Accent Stripe (cyan)
      c.fillStyle = "#0a84ff";
      c.fillRect(-60, -10, 75, 5);

      // Logo/Text on container
      c.fillStyle = "#1e293b";
      c.font = "bold 6px sans-serif";
      c.textAlign = "center";
      c.fillText("TẬN NHÀ", -22, -18);
      c.font = "bold 6px sans-serif";
      c.fillText("0932.188.892", -22, 2);

      // Draw Snowflake icon on truck
      c.fillStyle = "#0a84ff";
      c.beginPath();
      c.arc(-22, -8, 2.5, 0, Math.PI * 2);
      c.fill();

      // 5. Wheels
      const drawWheel = (wx: number, wy: number) => {
        c.save();
        c.translate(wx, wy);
        c.rotate(state.wheelsRotation);
        
        // Outer tyre
        c.fillStyle = "#111827";
        c.beginPath();
        c.arc(0, 0, 10, 0, Math.PI * 2);
        c.fill();

        // Inner rim
        c.fillStyle = "#94a3b8";
        c.beginPath();
        c.arc(0, 0, 5, 0, Math.PI * 2);
        c.fill();

        // Wheel spokes
        c.strokeStyle = "#475569";
        c.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          c.beginPath();
          c.moveTo(0, -9);
          c.lineTo(0, 9);
          c.stroke();
          c.rotate(Math.PI / 4);
        }
        c.restore();
      };

      drawWheel(-42, 16); // Rear wheel
      drawWheel(30, 16);  // Front wheel

      c.restore();
    };

    const drawSmokePuffs = (c: CanvasRenderingContext2D) => {
      c.fillStyle = isNightRef.current ? "rgba(255, 255, 255, 0.08)" : "rgba(100, 116, 139, 0.2)";
      state.smokePuffs.forEach((puff, idx) => {
        c.beginPath();
        c.arc(puff.x, puff.y, puff.size, 0, Math.PI * 2);
        c.fill();

        // Update puff
        puff.x -= 0.5 * state.truckDirection;
        puff.y -= 0.3;
        puff.size += 0.15;
        puff.opacity -= 0.015;

        // Clean up faded puffs
        if (puff.opacity <= 0) {
          state.smokePuffs.splice(idx, 1);
        }
      });
    };

    const drawEmoticons = (c: CanvasRenderingContext2D) => {
      state.emoticons.forEach((emo, idx) => {
        c.fillStyle = `rgba(16, 185, 129, ${emo.opacity})`;
        c.font = "bold 11px sans-serif";
        c.fillText(emo.text, emo.x, emo.y);

        // Update emoticons
        emo.y += emo.vy;
        emo.opacity -= 0.01;
        if (emo.opacity <= 0) {
          state.emoticons.splice(idx, 1);
        }
      });
    };

    // The Main Loop Animation
    const animate = () => {
      // Clear
      ctx.clearRect(0, 0, 800, 400);

      const isNightMode = isNightRef.current;
      const speedMultiplier = speedRef.current;

      // Draw static background
      drawSkyline(ctx, isNightMode);

      // Draw clouds & falling snow/ice
      drawClouds(ctx);
      drawSnow(ctx);

      // Draw static destinations
      drawWarehouse(ctx, isNightMode);
      drawHouse(ctx, isNightMode);

      // Draw road
      drawRoad(ctx, isNightMode);

      // Draw smoke
      drawSmokePuffs(ctx);

      // UPDATE SYSTEM STATE AND POSITIONS
      state.stateTimer += 1 * speedMultiplier;

      switch (state.truckState) {
        case "loading":
          setStatusText("Đang xếp thiết bị điện lạnh nhập khẩu lên xe...");
          setCurrentStage("loading");
          state.truckX = 120;
          state.truckDirection = 1;

          // Animation of appliances moving into the truck
          state.appliances.forEach((app, idx) => {
            const delay = idx * 60; // stagger loading
            if (state.stateTimer > delay) {
              app.stage = "loading";
              app.opacity = Math.min(1, app.opacity + 0.05 * speedMultiplier);
              app.scale = Math.min(1, app.scale + 0.03 * speedMultiplier);
              
              // Interpolate towards truck container x: 100, y: 275
              app.x += (100 - app.x) * 0.08 * speedMultiplier;
              app.y += (275 - app.y) * 0.08 * speedMultiplier;

              // Once close enough, mark as loaded inside truck
              if (Math.abs(app.x - 100) < 5 && Math.abs(app.y - 275) < 5 && app.stage === "loading") {
                app.stage = "in_truck";
                state.loadedCount += 1;
              }
            }
          });

          // Draw appliances that are still at warehouse or in transition
          state.appliances.forEach(app => {
            if (app.stage === "warehouse" || app.stage === "loading") {
              drawAppliance(ctx, app.type, app.x, app.y, app.color, app.scale);
            }
          });

          // Move to next stage once all 3 appliances are in the truck and delay holds
          if (state.loadedCount >= 3 && state.stateTimer > 240) {
            state.truckState = "transit";
            state.stateTimer = 0;
          }
          break;

        case "transit":
          setStatusText("Đang vận chuyển thiết bị đến nhà khách hàng...");
          setCurrentStage("transit");
          state.truckDirection = 1;
          
          // Drive from left to right (x: 120 -> 640)
          state.truckX += 2.5 * speedMultiplier;

          if (state.truckX >= 640) {
            state.truckX = 640;
            state.truckState = "unloading";
            state.stateTimer = 0;
          }
          break;

        case "unloading":
          setStatusText("Đang giao thiết bị điện lạnh và lắp đặt tận nơi...");
          setCurrentStage("unloading");
          state.truckX = 640;
          state.truckDirection = 1;

          // Animation of appliances moving out of truck into the house
          state.appliances.forEach((app, idx) => {
            const delay = idx * 60;
            if (state.stateTimer > delay) {
              if (app.stage === "in_truck") {
                app.stage = "unloading";
                // Start position: truck container location
                app.x = 620;
                app.y = 275;
                app.opacity = 1;
              }

              if (app.stage === "unloading") {
                // Interpolate towards house x: 720, y: 260
                app.x += (720 - app.x) * 0.08 * speedMultiplier;
                app.y += (260 - app.y) * 0.08 * speedMultiplier;
                app.scale = Math.max(0.6, app.scale - 0.01 * speedMultiplier);

                // Add emoticon sparks
                if (Math.random() < 0.08) {
                  state.emoticons.push({
                    x: app.x + (-10 + Math.random() * 20),
                    y: app.y - 10,
                    text: ["✓ Lắp Đặt", "❄ Lạnh Sâu", "♥ Uy Tín", "★ Tốt"][Math.floor(Math.random() * 4)],
                    opacity: 1,
                    vy: -0.6 - Math.random() * 0.6,
                  });
                }

                if (Math.abs(app.x - 720) < 5 && Math.abs(app.y - 260) < 5) {
                  app.stage = "house";
                  state.unloadedCount += 1;
                }
              }
            }
          });

          // Draw unloading appliances
          state.appliances.forEach(app => {
            if (app.stage === "unloading") {
              drawAppliance(ctx, app.type, app.x, app.y, app.color, app.scale);
            }
          });

          if (state.unloadedCount >= 3 && state.stateTimer > 240) {
            state.truckState = "returning";
            state.stateTimer = 0;
          }
          break;

        case "returning":
          setStatusText("Hoàn tất lắp đặt. Xe quay trở lại kho hàng để tiếp tục nhập hàng mới...");
          setCurrentStage("returning");
          state.truckDirection = -1; // Heading left
          
          // Drive from right to left (x: 640 -> 120)
          state.truckX -= 2.5 * speedMultiplier;

          if (state.truckX <= 120) {
            state.truckX = 120;
            state.truckState = "loading";
            state.stateTimer = 0;
            state.loadedCount = 0;
            state.unloadedCount = 0;
            
            // Reset appliance positions
            state.appliances.forEach((app, idx) => {
              app.x = 40;
              app.y = 260 - idx * 25;
              app.opacity = 0;
              app.scale = 0.5;
              app.stage = "warehouse";
            });
          }
          break;
      }

      // Draw the truck
      drawTruck(ctx, state.truckX, state.truckY, state.truckDirection, isNightMode);

      // Draw floating emoticons on top
      drawEmoticons(ctx);

      // Request next frame
      animationId = requestAnimationFrame(animate);
    };

    // Start Loop
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="py-20 bg-[#f5f9ff] relative z-10 border-t border-slate-100/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold text-[#0a84ff] tracking-widest block">Quy trình lưu thông</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1e293b]">
            Vận Chuyển & Nhập Hàng Tận Nơi
          </h2>
          <div className="h-1 bg-[#0a84ff] w-16 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-[#1e293b]/70 text-sm leading-relaxed">
            Mô phỏng hành trình nhập khẩu thiết bị chất lượng cao về kho lưu trữ, kiểm định nghiêm ngặt và vận chuyển lắp đặt tận nhà nhanh chóng trong 30 phút.
          </p>
        </div>

        {/* Canvas Card Container */}
        <div className="bg-white rounded-[30px] p-6 border border-slate-100 shadow-xl overflow-hidden flex flex-col items-center">
          
          {/* Canvas Wrapper */}
          <div className="relative w-full max-w-[800px] aspect-[2/1] rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-[#e0f2fe] select-none">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-full block object-cover"
            />
            
            {/* Overlay stage badge */}
            <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span className={`w-2.5 h-2.5 rounded-full ${
                currentStage === "loading" ? "bg-amber-400 animate-pulse" :
                currentStage === "transit" ? "bg-sky-400 animate-bounce" :
                currentStage === "unloading" ? "bg-emerald-400 animate-ping" : "bg-slate-400"
              }`} />
              Trạng thái: {
                currentStage === "loading" ? "Đang Nhập Hàng" :
                currentStage === "transit" ? "Đang Vận Chuyển" :
                currentStage === "unloading" ? "Giao Hàng Lắp Đặt" : "Quay Lại Kho"
              }
            </div>

            {/* Weather status indicator */}
            <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              {isNight ? <Moon className="w-3.5 h-3.5 text-yellow-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />}
              Thời tiết: {isNight ? "Ban đêm (Bật đèn pha)" : "Ban ngày (Nắng mát)"}
            </div>
          </div>

          {/* Interactive controls panel */}
          <div className="w-full max-w-[800px] mt-6 bg-[#f5f9ff] border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left status log */}
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2.5 bg-[#0a84ff]/10 rounded-xl text-[#0a84ff]">
                <Package className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#1e293b]/55 uppercase tracking-wider block">Giám sát xe tải</span>
                <p className="text-xs font-bold text-[#1e293b] leading-tight line-clamp-1">{statusText}</p>
              </div>
            </div>

            {/* Right Buttons group */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              
              {/* Day/Night toggle */}
              <button
                onClick={() => setIsNight(!isNight)}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1e293b] text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm transition-colors cursor-pointer"
                title="Đổi giao diện ngày/đêm"
              >
                {isNight ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ban ngày</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Ban đêm</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
