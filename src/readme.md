model Analytics {
  id           Int      @id @default(autoincrement())
  blogViews    Int      @default(0)
  resumesMade  Int      @default(0)
  createdAt    DateTime @default(now())
}
