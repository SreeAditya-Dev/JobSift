import re
with open('frontend/src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r"import \{ useTheme \} from '@/context/ThemeContext';\n", "", content)
content = re.sub(r"  const \{ theme, toggleTheme \} = useTheme\(\);\n", "", content)
content = re.sub(r"  const \[isNotificationsOpen, setIsNotificationsOpen\] = useState\(false\);\n", "", content)
content = re.sub(r"  const \[notifications, setNotifications\] = useState<NotificationItem\[\]>\(SAMPLE_NOTIFICATIONS\);\n", "", content)
content = re.sub(r"  const notifMenuRef = useRef<HTMLDivElement>\(null\);\n", "", content)
content = re.sub(r"  const unreadCount = notifications\.filter\(\(n\) => n\.unread\)\.length;\n", "", content)
content = re.sub(r"  const markAllNotificationsRead = \(\) => \{\n    setNotifications\(\(prev\) => prev\.map\(\(n\) => \(\{ \.\.\.n, unread: false \}\)\)\);\n  \};\n", "", content)

# Remove click outside for notif
content = re.sub(r"      if \(notifMenuRef\.current && !notifMenuRef\.current\.contains\(event\.target as Node\)\) \{\n        setIsNotificationsOpen\(false\);\n      \}\n", "", content)

# Also remove NotificationItem interface and SAMPLE_NOTIFICATIONS
content = re.sub(r"interface NotificationItem \{.*?\n\}\n", "", content, flags=re.DOTALL)
content = re.sub(r"const SAMPLE_NOTIFICATIONS: NotificationItem\[\] = \[.*?\n\];\n", "", content, flags=re.DOTALL)

with open('frontend/src/components/layout/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
