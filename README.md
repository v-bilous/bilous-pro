# Terminal-Style Personal Website

A personal website for [bilous.pro](https://bilous.pro) built in a terminal style using the Catppuccin Mocha color scheme. This project creates an interactive terminal-like interface to showcase professional information in a unique and engaging way.

![Terminal Website Screenshot](https://via.placeholder.com/800x450.png?text=Terminal+Website+Screenshot)

## Features

- 🖥️ Authentic terminal experience with command-line interface
- 🎨 Beautiful Catppuccin Mocha color scheme
- 💻 Interactive commands to explore professional information
- 📱 Responsive design that works on desktop and mobile devices
- ⌨️ Command history navigation with up/down arrow keys
- 🔄 Tab completion for commands
- 🪟 Terminal window controls (minimize, maximize, close)
- 🔗 Clickable links in command outputs

## Available Commands

| Command | Description |
|---------|-------------|
| `help` | Display available commands |
| `about` | Display information about Vova Bilous |
| `experience` | Show professional experience |
| `stack` | List technical skills and tools |
| `projects` | View notable projects |
| `contact` | Show contact information |
| `clear` | Clear the terminal screen |
| `date` | Display current date and time |
| `echo [text]` | Echo a message |
| `whoami` | Display current user |
| `ls` | List directory contents |
| `cat [filename]` | Display file contents |

## Keyboard Shortcuts

- `Up/Down Arrow`: Navigate through command history
- `Tab`: Command auto-completion
- `Ctrl+L`: Clear the terminal screen

## Technologies Used

- HTML5 for semantic structure
- CSS3 with custom properties for styling
- Vanilla JavaScript for interactivity
- Catppuccin Mocha color palette
- Responsive design principles
- Accessibility features

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vovabilous/bilous-pro.git
   cd bilous-pro
   ```

2. Open the project:
   - For local development, simply open `index.html` in your browser
   - For production, deploy the files to your web server

## Customization

### Changing Personal Information

Edit the command definitions in `script.js` to update the personal information:

```javascript
const COMMANDS = {
  about: {
    description: "Display information about you",
    execute: () => {
      return `Your custom about information`;
    }
  },
  // Other commands...
};
```

### Modifying the Theme

The website uses the Catppuccin Mocha color scheme. You can modify the colors in the `:root` section of `style.css`:

```css
:root {
  --ctp-base: #1e1e2e;
  /* Other color variables... */
}
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Catppuccin](https://github.com/catppuccin/catppuccin) for the beautiful color scheme
- Inspiration from terminal UIs and retro computing

---

Created with ❤️ by [Vova Bilous](https://github.com/vovabilous)
