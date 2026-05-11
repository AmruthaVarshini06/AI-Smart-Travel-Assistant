# 🎤 Developer Quick Reference - Microphone Voice Input

## Code Architecture

### Component: [src/components/travel/AIAssistant.tsx](src/components/travel/AIAssistant.tsx)

### State Variables
```typescript
const [isListening, setIsListening] = useState(false);           // Recording active?
const [input, setInput] = useState('');                          // Input field text
const [interimTranscript, setInterimTranscript] = useState('');  // Real-time speech display
const [finalTranscript, setFinalTranscript] = useState('');      // Confirmed speech
const [micError, setMicError] = useState('');                    // Error message
```

### Refs
```typescript
const recognitionRef = useRef<any>(null);                        // Speech Recognition instance
const inputRef = useRef<HTMLInputElement>(null);                 // Input DOM element
const recognitionErrorShownRef = useRef(false);                  // Error dedup flag
```

### Main Functions
1. **`initializeSpeechRecognition()`** - Sets up the Speech Recognition API
2. **`handleMicClick()`** - Start/stop recording
3. **`speakResponse()`** - Text-to-speech
4. **`handleSend()`** - Send message to AI

---

## Speech Recognition Setup

### Initialization
```typescript
const SpeechRecognitionClass = 
  (window as any).SpeechRecognition || 
  (window as any).webkitSpeechRecognition;

const recognition = new SpeechRecognitionClass();

// Configuration
recognition.continuous = false;
recognition.interimResults = true;
recognition.language = 'en-IN';
```

### Key Settings
| Setting | Value | Purpose |
|---------|-------|---------|
| `continuous` | false | Stop after one sentence |
| `interimResults` | true | Show speech in real-time |
| `language` | 'en-IN' | Indian English |

---

## Event Handlers

### 1. onstart - Recording Begins
```typescript
recognition.onstart = () => {
  console.log('🎤 [Speech] ✅ Recognition started');
  setIsListening(true);
  setInterimTranscript('');
  setFinalTranscript('');
  setMicError('');
};
```

### 2. onresult - Speech Detected
```typescript
recognition.onresult = (event: any) => {
  let interimText = '';
  let finalText = '';

  // Process all results
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    const confidence = event.results[i][0].confidence;

    if (event.results[i].isFinal) {
      finalText += transcript + ' ';  // User finished this word
    } else {
      interimText += transcript;      // User still speaking
    }
  }

  // Update displays
  if (interimText) setInterimTranscript(interimText);
  
  if (finalText) {
    setFinalTranscript(finalText.trim());
    setInput(prevInput => 
      prevInput 
        ? `${prevInput} ${finalText.trim()}` 
        : finalText.trim()
    );
  }
};
```

### 3. onerror - Something Went Wrong
```typescript
recognition.onerror = (event: any) => {
  const errorType = event.error;
  
  // Handle different error types
  switch(errorType) {
    case 'no-speech':
      errorMsg = 'No speech detected. Please try again.';
      break;
    case 'audio-capture':
      errorMsg = 'No microphone found.';
      break;
    case 'not-allowed':
      errorMsg = 'Microphone permission denied.';
      break;
    // ... other cases
  }

  setMicError(errorMsg);
};
```

### 4. onend - Recording Ends
```typescript
recognition.onend = () => {
  console.log('🛑 [Speech] Recognition ended');
  setIsListening(false);
  setInterimTranscript('');
};
```

---

## Button Click Handler

### Start/Stop Logic
```typescript
const handleMicClick = () => {
  if (!recognitionRef.current) {
    // Not supported
    showError('Speech recognition not available');
    return;
  }

  try {
    if (isListening) {
      // STOP
      recognitionRef.current.stop();
    } else {
      // START
      recognitionRef.current.start();
    }
  } catch (error) {
    showError('Failed to control microphone');
  }
};
```

### State Flow
```
NOT LISTENING → Click Mic → START RECORDING
    ↓                              ↓
Show input                    Show listening UI
field                         with animation
    ↓                              ↓
    ←──────────────────────────────
                Click Stop
              STOP RECORDING
```

---

## Error Types & Handling

### Browser Support Errors
```typescript
// No SpeechRecognition API
if (!SpeechRecognitionClass) {
  console.warn('⚠️ [Speech] API not supported');
  setMicError('Browser does not support speech recognition');
  return;
}
```

### Runtime Errors
| Error | Meaning | Solution |
|-------|---------|----------|
| `no-speech` | Silent/no mic | Ask user to speak louder |
| `audio-capture` | No microphone | Check device microphone |
| `not-allowed` | Permission denied | Ask user to allow access |
| `network` | Internet issue | Check connectivity |
| `service-not-available` | API overloaded | Try again later |
| `aborted` | User stopped | Normal, not an error |

---

## Debugging Techniques

### Enable Console Logging
```typescript
const DEBUG = true;  // Set to false to disable

const log = (emoji: string, label: string, message: any) => {
  if (DEBUG) {
    console.log(`${emoji} [${label}] ${message}`);
  }
};
```

### Check Recognition State
```typescript
// In browser console:
// Check if API exists
window.SpeechRecognition || window.webkitSpeechRecognition

// Check permissions
navigator.permissions.query({name: 'microphone'})
```

### Monitor Event Flow
```typescript
// All events logged with [Speech] prefix
// Search console for [Speech] to see sequence
```

### Read Error Details
```typescript
// Console shows:
❌ [Speech] Recognition error: not-allowed
// "not-allowed" = permission denied
// Check browser settings
```

---

## State Management Patterns

### Setting Input from Speech
```typescript
// DON'T do this:
setInput(finalText);  // Loses existing text

// DO this:
setInput(prevInput => 
  prevInput 
    ? `${prevInput} ${finalText}` 
    : finalText
);  // Preserves and appends
```

### Interim vs Final
```typescript
// Interim - displayed in real-time, temporary
setInterimTranscript('typing...');

// Final - confirmed, goes to input field
setInput(finalText);

// Clear interim after final
setInterimTranscript('');
```

### Error Message Display
```typescript
// Show error only once per session
recognitionErrorShownRef.current = false;

if (!recognitionErrorShownRef.current) {
  setMicError(errorMsg);
  recognitionErrorShownRef.current = true;
}
```

---

## Performance Optimization

### Cleanup on Unmount
```typescript
return () => {
  // Stop recording
  if (recognitionRef.current) {
    recognitionRef.current.abort();
  }
  
  // Cancel speech
  window.speechSynthesis?.cancel();
};
```

### Prevent Memory Leaks
```typescript
// Use refs instead of state for long-lived objects
const recognitionRef = useRef<any>(null);  // ✅ Good
// vs
const [recognition, setRecognition] = useState(null);  // ❌ Bad
```

### Optimize Re-renders
```typescript
// Only re-render on state changes
const [isListening, setIsListening] = useState(false);
// Component re-renders when this changes
// UI updates only necessary parts
```

---

## Testing Code

### Unit Test Template
```typescript
describe('Microphone Recognition', () => {
  it('should start recording on mic click', () => {
    // Arrange
    const { getByTitle } = render(<AIAssistant />);
    const micButton = getByTitle('Click to use voice input');

    // Act
    fireEvent.click(micButton);

    // Assert
    expect(recognitionRef.current.start).toHaveBeenCalled();
  });

  it('should stop recording on second click', () => {
    // ... similar pattern
  });
});
```

### Integration Test Template
```typescript
it('should capture speech and update input', async () => {
  // Setup
  const mockRecognition = {
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    onstart: null,
    onend: null,
  };

  // Mock the API
  // Trigger onstart
  // Trigger onresult with final text
  // Assert input field has text
});
```

---

## Common Modifications

### Change Language
```typescript
// Line in useEffect
recognition.language = 'en-US';  // English US
// or
recognition.language = 'es-ES';  // Spanish Spain
// or
recognition.language = 'fr-FR';  // French France
```

### Change Response Length
```typescript
// Currently: max 2048 tokens
// In handleSend():
generationConfig: {
  maxOutputTokens: 2048,  // Change this
}
```

### Disable Interim Display
```typescript
// For cleaner UI, disable interim results
recognition.interimResults = false;  // Don't show while speaking
// Text only appears after stop
```

### Add Animations
```typescript
// Currently uses framer-motion
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  <Mic />
</motion.div>
```

---

## Troubleshooting Checklist

### Mic Not Starting
- [ ] Check console for SpeechRecognitionClass error
- [ ] Verify browser supports API
- [ ] Check microphone permissions
- [ ] Try different browser
- [ ] Check if port 5173 is accessible

### Text Not Appearing
- [ ] Check "FINAL result" in console
- [ ] Verify isFinal is true in event
- [ ] Check setInput is called
- [ ] Check React DevTools for state update
- [ ] Try speaking more clearly

### Stopping Issues
- [ ] Verify recognitionRef is not null
- [ ] Check for exceptions in stop() call
- [ ] Look for "Recognition ended" in console
- [ ] Try aborting instead of stopping

### Error Not Showing
- [ ] Check recognitionErrorShownRef flag
- [ ] Verify setMicError was called
- [ ] Check micError state in DevTools
- [ ] Verify error UI component renders

---

## Browser DevTools Tips

### Chrome DevTools
1. F12 → Console tab
2. Search for `[Speech]` or `[Mic]`
3. Check for error messages starting with ❌
4. Use `error` keyword to filter errors

### State Inspector
1. F12 → Elements tab
2. Search for input value
3. Check if it updates with speech

### Network Tab
1. F12 → Network tab
2. Check Groq API calls
3. Verify response times

---

## Quick Links

- [Speech Recognition API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Browser Support](https://caniuse.com/speech-recognition)
- [Component File](src/components/travel/AIAssistant.tsx)
- [Testing Guide](MICROPHONE_TESTING.md)

---

## Support Commands

### Check Logs
```bash
# In browser console:
// Search for [Speech]
console.log('%c[Speech]', 'color: blue');
```

### Reset State
```typescript
// In browser console:
window.location.reload();  // Hard refresh

// Or in code:
setIsListening(false);
setInterimTranscript('');
setFinalTranscript('');
```

### Monitor Permission
```typescript
// Check permission status
navigator.permissions.query({name: 'microphone'})
  .then(status => console.log('Mic permission:', status.state));
```

---

**Last Updated**: May 2026  
**Status**: ✅ Complete and Tested  
**Confidence**: High
