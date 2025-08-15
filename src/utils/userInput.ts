import * as readline from 'readline';

export function getUserInput(promptMessage: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(promptMessage, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

export function getHiddenInput(promptMessage: string): Promise<string> {
  return new Promise(resolve => {
    process.stdout.write(promptMessage);
    
    // Setup stdin for raw mode to capture keystrokes
    const stdin = process.stdin;
    
    // Save original stdin settings
    const wasRaw = stdin.isRaw;
    
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    
    const onData = (char: string) => {
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl+D
          // Restore stdin settings
          stdin.setRawMode(wasRaw);
          stdin.pause();
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(password);
          return;
        case '\u0003': // Ctrl+C
          // Restore stdin settings
          stdin.setRawMode(wasRaw);
          stdin.pause();
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          process.exit(1);
        case '\u007f': // Backspace (DEL)
        case '\u0008': // Backspace (BS)
          if (password.length > 0) {
            password = password.slice(0, -1);
            // Move cursor back, write space, move cursor back again
            process.stdout.write('\b \b');
          }
          break;
        default:
          // Only handle printable characters
          if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
            password += char;
            process.stdout.write('*');
          }
          break;
      }
    };
    
    stdin.on('data', onData);
  });
}
