// DOM Elements
const input = document.getElementById("input");
const output = document.getElementById("output");
const currentYearElement = document.getElementById("current-year");
const terminalContent = document.querySelector(".terminal-content");
const controls = document.querySelectorAll(".control");

// Terminal State
const state = {
  commandHistory: [],
  historyIndex: -1,
  commandSuggestions: [],
  suggestionsIndex: -1,
};

// Initialize Terminal
function initTerminal() {
  // Set current year in footer
  currentYearElement.textContent = new Date().getFullYear();

  // Focus input on terminal click
  document.getElementById("terminal").addEventListener("click", () => {
    input.focus();
  });

  // Terminal window controls
  controls.forEach((control) => {
    control.addEventListener("click", (e) => {
      e.stopPropagation();
      if (control.classList.contains("close")) {
        appendToOutput(
          "Terminal session closed. Refresh the page to restart.",
          "info",
        );
        setTimeout(() => {
          document.getElementById("terminal").classList.add("closed");
        }, 500);
      } else if (control.classList.contains("minimize")) {
        document.getElementById("terminal").classList.toggle("minimized");
      } else if (control.classList.contains("maximize")) {
        document.getElementById("terminal").classList.toggle("maximized");
      }
    });
  });

  // Auto-focus input on page load
  input.focus();
}

// Event Listeners
input.addEventListener("keydown", handleKeyDown);

// Handle keyboard input
function handleKeyDown(e) {
  // Enter key - process command
  if (e.key === "Enter") {
    const command = input.value.trim();
    if (command) {
      processCommand(command);
      state.commandHistory.unshift(command);
      state.historyIndex = -1;
      input.value = "";
    }
    return;
  }

  // Up arrow - navigate command history
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (state.commandHistory.length > 0) {
      state.historyIndex = Math.min(
        state.historyIndex + 1,
        state.commandHistory.length - 1,
      );
      input.value = state.commandHistory[state.historyIndex];
      // Move cursor to end of input
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = input.value.length;
      }, 0);
    }
    return;
  }

  // Down arrow - navigate command history
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.historyIndex > 0) {
      state.historyIndex--;
      input.value = state.commandHistory[state.historyIndex];
    } else if (state.historyIndex === 0) {
      state.historyIndex = -1;
      input.value = "";
    }
    return;
  }

  // Tab - command completion
  if (e.key === "Tab") {
    e.preventDefault();
    const currentInput = input.value.trim();

    if (currentInput) {
      const suggestions = Object.keys(COMMANDS).filter(
        (cmd) => cmd.startsWith(currentInput) && cmd !== currentInput,
      );

      if (suggestions.length === 1) {
        // Single suggestion - autocomplete
        input.value = suggestions[0];
      } else if (suggestions.length > 1) {
        // Multiple suggestions - show options
        appendToOutput(`\nSuggestions: ${suggestions.join(", ")}`, "info");
        appendPrompt();
        input.value = currentInput;
      }
    }
    return;
  }

  // Ctrl+L - clear terminal
  if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    clearTerminal();
    return;
  }
}

// Command definitions
const COMMANDS = {
  help: {
    description: "Display available commands",
    execute: () => {
      let helpText = "Available commands:\n\n";

      Object.keys(COMMANDS)
        .sort()
        .forEach((cmd) => {
          helpText += `<span class="command">${cmd}</span> - ${COMMANDS[cmd].description}\n`;
        });

      helpText +=
        "\nTip: Use Tab for command completion, Up/Down arrows for command history, and Ctrl+L to clear the terminal.";
      return helpText;
    },
  },

  about: {
    description: "Display information about Vova Bilous",
    execute: () => {
      return `<span class="info">I build scalable software systems — from scratch or inside complex infrastructures.</span>

My expertise spans software architecture, backend engineering, frontend integration, cloud infrastructure, CI/CD automation, and performance optimization. I work across the full stack — from UI to backend to infrastructure — and integrate financial systems, crypto workflows, and AI-driven tools to create intelligent platforms.

I manage the entire lifecycle: designing, coding, integrating, automating, and delivering. With or without a team — I handle complex engineering challenges independently and deliver production-grade results.

From e-commerce and telco to fintech, gaming, and IoT — I’ve delivered secure, high-performance systems and introduced company-wide innovations in code generation and developer experience.

I value clarity, pragmatic design, and continuous learning.`;
    },
  },

  experience: {
    description: "Show professional experience",
    execute: () => {
      return `<span class="info">Professional Experience:</span>

Designed and delivered large-scale platforms in e-commerce, telecommunications, IoT, gaming, healthcare, and fintech — working across the full stack from frontend to backend to cloud infrastructure.

Built and optimized distributed systems using Java, Kotlin, and Spring — with a focus on performance, maintainability, and developer experience.

Introduced metadata-driven, API-first development practices and created internal code generation frameworks adopted across entire engineering organizations.

Migrated complex monolithic and on-prem systems to cloud-native environments (AWS), implementing infrastructure-as-code, telemetry, and CI/CD at scale.

Developed multi-currency payment systems with real-time fiat and crypto support — including secure pipelines, smart routing, and external integrations.

Implemented full-stack developer tooling, internal platforms, and workflows to accelerate delivery and standardize architecture patterns.

Led and mentored engineering teams (10–20+ people), scaled Agile and DevOps practices, and drove organization-wide initiatives in platform modernization and automation.

Integrated AI-based components and internal tools to automate operations, enhance observability, and enable smart platform behavior.

Collaborated closely with stakeholders, founders, and executives — translating business requirements into scalable, production-grade architecture.

Type <span class="command">stack</span> to see my technical skills.`;
    },
  },

  stack: {
    description: "List technical skills and tools",
    execute: () => {
      return `<span class="info">Technical Stack:</span>

<span class="success">Languages:</span> Java, Kotlin, JavaScript, TypeScript, Python, Bash, SQL

<span class="success">Frameworks:</span> Spring Boot, Quarkus, React, Node.js

<span class="success">Data:</span> PostgreSQL, Redis, Kafka, Elasticsearch, MongoDB

<span class="success">Cloud:</span> AWS, Docker, Kubernetes, Terraform

<span class="success">Tools:</span> Neovim, Zellij, Git, IntelliJ IDEA, Arch

<span class="success">Practices:</span> TDD, CI/CD, Microservices, Event-Driven Architecture`;
    },
  },

  services: {
    description: "Explore professional services offered",
    execute: () => {
      return `<span class="info">Services:</span>

<span class="success">🧠 Full-Stack Architecture</span>
- From UI to backend to infrastructure
- Scalable, cloud-native, production-ready systems

<span class="success">🚀 Startup Acceleration</span>
- From MVP to full product delivery
- I design, build, and ship end-to-end solutions — solo or with your team

<span class="success">🤖 AI & Smart Automation</span>
- AI-assisted features, LLM integration, internal tools
- Automate ops, augment UX, and ship smarter platforms

<span class="success">💳 Fintech & Payments</span>
- Multi-currency (incl. crypto), secure transaction pipelines
- Real-time flows, smart routing, integration with external providers

<span class="success">📦 Developer Experience & Codegen</span>
- API-first systems with OpenAPI/AsyncAPI
- Internal tooling, metadata-driven architecture, code generation

<span class="info">You bring the idea. I bring the repo, CI, infra, and caffeine. Let's ship.</span>`;
    },
  },

  contact: {
    description: "Show contact information",
    execute: () => {
      return `<span class="info">Contact Information:</span>

📫 Email: <a href="mailto:vova@bilous.pro" class="link">vova@bilous.pro</a>
🔗 Telegram: <a href="https://t.me/v_bilous" target="_blank" class="link">https://t.me/v_bilous</a>
💼 LinkedIn: <a href="https://linkedin.com/in/vovabilous" target="_blank" class="link">linkedin.com/in/vova-bilous</a>
📁 GitHub: <a href="https://github.com/vovabilous" target="_blank" class="link">github.com/v-bilous</a>

Feel free to reach out for collaboration opportunities or just to say hello!`;
    },
  },

  clear: {
    description: "Clear the terminal screen",
    execute: () => {
      clearTerminal();
      return "";
    },
  },

  date: {
    description: "Display current date and time",
    execute: () => {
      return `Current date and time: ${new Date().toLocaleString()}`;
    },
  },

  echo: {
    description: "Echo a message",
    execute: (args) => {
      return args || "";
    },
  },

  whoami: {
    description: "Display current user",
    execute: () => {
      return "vova";
    },
  },

  ls: {
    description: "List directory contents",
    execute: () => {
      return `about.txt  contact.md  experience.log  services.json  stack.yml`;
    },
  },

  cat: {
    description: "Display file contents",
    execute: (args) => {
      const files = {
        "about.txt": COMMANDS.about.execute(),
        "contact.md": COMMANDS.contact.execute(),
        "experience.log": COMMANDS.experience.execute(),
        "services.json": COMMANDS.services.execute(),
        "stack.yml": COMMANDS.stack.execute(),
      };

      if (!args) {
        return `<span class="error">Error: No file specified</span>`;
      }

      return (
        files[args] ||
        `<span class="error">Error: File '${args}' not found</span>`
      );
    },
  },
};

// Process user command
function processCommand(commandText) {
  // Split command and arguments
  const [cmd, ...args] = commandText.split(" ");
  const argsText = args.join(" ");

  // Display command in output
  appendToOutput(
    `<span class="prompt">vova@bilous.pro ~$</span> <span class="command">${commandText}</span>`,
    "command-line",
  );

  // Execute command if it exists
  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd].execute(argsText);
    if (result) {
      appendToOutput(result);
    }
  } else {
    appendToOutput(
      `<span class="error">Command not found: ${cmd}</span>\nType <span class="command">help</span> to see available commands.`,
    );
  }

  // Scroll to bottom
  scrollToBottom();
}

// Append text to terminal output
function appendToOutput(text, className = "") {
  const outputElement = document.createElement("div");
  outputElement.className = className;
  outputElement.innerHTML = text;
  output.appendChild(outputElement);
  scrollToBottom();
}

// Append prompt line to output
function appendPrompt() {
  appendToOutput(
    `<span class="prompt">vova@bilous.pro ~$</span> `,
    "command-line",
  );
}

// Clear terminal
function clearTerminal() {
  output.innerHTML =
    'Terminal cleared. Type <span class="command">help</span> to see available commands.\n';
}

// Scroll terminal to bottom
function scrollToBottom() {
  terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Generate fastfetch-like display
function generateFastfetch() {
  // ASCII art logo (simplified arch-like logo)
  const logo = [
    '<span class="fastfetch-logo-blue">       /\\       </span>',
    '<span class="fastfetch-logo-blue">      /  \\      </span>',
    '<span class="fastfetch-logo-blue">     /\\   \\     </span>',
    '<span class="fastfetch-logo-blue">    /      \\    </span>',
    '<span class="fastfetch-logo-blue">   /   ,,   \\   </span>',
    '<span class="fastfetch-logo-blue">  /   |  |  -\\  </span>',
    '<span class="fastfetch-logo-blue"> /_-\\"    \\"-_\\ </span>',
  ];

  // Information items with different colors
  const info = [
    '<span class="fastfetch-label">name</span>     <span class="fastfetch-value">Vova Bilous</span>',
    '<span class="fastfetch-label">email</span>    <span class="fastfetch-value">vova@bilous.pro</span>',
    '<span class="fastfetch-label">github</span>   <span class="fastfetch-value">github.com/v-bilous</span>',
    '<span class="fastfetch-label">langs</span>    <span class="fastfetch-value">Java, Kotlin, TypeScript, Python, Bash</span>',
    '<span class="fastfetch-label">tools</span>    <span class="fastfetch-value">Neovim, Zellij, Git, IntelliJ IDEA, Arch</span>',
  ];

  // Combine logo and info
  let result = '<div class="fastfetch-container">';

  // Calculate the maximum number of lines
  const maxLines = Math.max(logo.length, info.length);

  for (let i = 0; i < maxLines; i++) {
    result += '<div class="fastfetch-line">';

    // Add logo part if available
    if (i < logo.length) {
      result += logo[i];
    } else {
      result += '<span class="fastfetch-logo-spacer">              </span>';
    }

    // Add separator
    result += '<span class="fastfetch-separator">  </span>';

    // Add info part if available
    if (i < info.length) {
      result += info[i];
    }

    result += "</div>";
  }

  result += "</div>";
  return result;
}

// Initialize terminal on page load
document.addEventListener("DOMContentLoaded", () => {
  initTerminal();

  // Add CSS classes for styling
  document.querySelectorAll(".terminal-content div").forEach((el) => {
    if (el.textContent.includes("Command not found")) {
      el.classList.add("error");
    }
  });

  // Display fastfetch-like component
  appendToOutput(generateFastfetch());

  // Add animation effect to terminal on load
  setTimeout(() => {
    document.getElementById("terminal").classList.add("loaded");
  }, 100);
});
