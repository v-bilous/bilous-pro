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
      return `<span class="info">Principal Software Engineer with 15+ years of experience.</span>

I build scalable systems, mentor teams, and design cloud-native architectures.
My focus is on creating robust, maintainable software solutions that solve real-world problems.

I'm passionate about clean code, performance optimization, and continuous learning.`;
    },
  },

  experience: {
    description: "Show professional experience",
    execute: () => {
      return `<span class="info">Professional Experience:</span>

Led architecture and development of scalable, high-load platforms in industries including e-commerce, telecom, IoT, healthcare, and gaming.

Built and optimized distributed systems using Java, Kotlin, and Spring ecosystem with a focus on clean, maintainable code and performance under load.

Introduced metadata-driven, API-first development processes with code generation that streamlined delivery across multiple teams.

Migrated complex on-prem systems to the cloud (AWS), implementing infrastructure-as-code, observability, and CI/CD practices at scale.

Designed multi-currency payment systems with real-time crypto and fiat support, integrating secure and performant transactional pipelines.

Managed and mentored cross-functional teams (10–30+ engineers), introduced Agile/Scrum frameworks, and drove cultural shifts toward DevOps and automation.

Collaborated directly with stakeholders and executives, aligning technical decisions with business goals and long-term product vision.

Type <span class="command">stack</span> to see my technical skills.`;
    },
  },

  stack: {
    description: "List technical skills and tools",
    execute: () => {
      return `<span class="info">Technical Stack:</span>

<span class="success">Languages:</span> Java, Kotlin, JavaScript, TypeScript, SQL

<span class="success">Frameworks:</span> Spring Boot, Spring Cloud, React, Node.js

<span class="success">Data:</span> PostgreSQL, Redis, Kafka, Elasticsearch, MongoDB

<span class="success">Cloud:</span> AWS, Docker, Kubernetes, Terraform

<span class="success">Tools:</span> Neovim, Zellij, Git, IntelliJ IDEA, Linux

<span class="success">Practices:</span> TDD, CI/CD, Microservices, Event-Driven Architecture`;
    },
  },

  projects: {
    description: "View notable projects",
    execute: () => {
      return `<span class="info">Notable Projects:</span>

<span class="success">Multi-currency Crypto Payment System</span>
- Scalable payment processing platform
- Handling thousands of transactions per second
- Secure wallet management and exchange integration

<span class="success">Cloud-native API-first Codegen Framework</span>
- Automated code generation from API specifications
- Reduced development time by 40%
- Consistent API implementation across services

<span class="success">Real-time Telemetry and Streaming Platform</span>
- IoT data collection and analysis
- Low-latency event processing
- Visualization and alerting system`;
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
      return `about.txt  contact.md  experience.log  projects.json  stack.yml`;
    },
  },

  cat: {
    description: "Display file contents",
    execute: (args) => {
      const files = {
        "about.txt": COMMANDS.about.execute(),
        "contact.md": COMMANDS.contact.execute(),
        "experience.log": COMMANDS.experience.execute(),
        "projects.json": COMMANDS.projects.execute(),
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
    '<span class="fastfetch-label">role</span>     <span class="fastfetch-value">Principal Software Engineer</span>',
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
