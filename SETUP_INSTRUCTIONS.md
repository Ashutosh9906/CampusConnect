# Setup Instructions - What You Need to Do

## 1. Install Required Dependencies

Run this command in your project root:

```bash
npm install nodemailer
```

**Why**: Email sending for OTP delivery.

---

## 2. Update `.env` File

Add these environment variables:

```env
# Gmail Configuration for OTP Email
USER_EMAIL=your_email@gmail.com
APP_PASS=your_app_password_here

# Keep your existing variables:
# DATABASE_URL=...
# SECRET=...
# VITE_API_URL=...
# etc.
```

### How to Get Gmail App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Go to "App passwords" (requires 2FA)
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password
6. Use this in `APP_PASS`

**Important**: Use the 16-character app password, NOT your regular Gmail password.

---

## 3. Database Migration (Already Done)

The Prisma migration to remove `appwriteUserId` has already been applied:

```
Migration: 20260426053212_remove_appwrite_user_id
Status: ✅ Applied
```

Your database is already updated. If needed, you can reset with:

```bash
npx prisma db push
```

---

## 4. Verify Installation

Start your server:

```bash
npm run dev
```

Should start without errors. If you see:
```
✅ Server started at PORT: 8000
```

You're ready to go!

---

## 5. Test the Flow

### Registration Test:
1. Go to `/register`
2. Enter email → Click "Send OTP"
3. Check email inbox for 6-digit code
4. Enter OTP → Click "Verify OTP"
5. Fill profile details → Submit

### Login Test:
1. Go to `/login`
2. Enter registered email and password
3. Click "Sign In"
4. Should redirect to home page

### Token Expiration Test:
1. Login successfully
2. Wait 12 hours (or manually delete token cookie in DevTools)
3. Token should expire and user should be logged out automatically

---

## 6. Frontend Environment Variables

Ensure these are set in your `.env` or `.env.local`:

```
VITE_API_URL=http://localhost:8000  # or your deployed backend URL
```

---

## 7. Remove AppWrite (Optional Cleanup)

You can optionally uninstall AppWrite since it's no longer used:

```bash
npm uninstall node-appwrite appwrite
```

The following files/components are no longer used but safe to keep:
- `frontend/src/config/appwrite.js`
- `frontend/src/components/auth/GoogleButton.jsx`
- `frontend/src/pages/auth/GoogleSuccessLogin.jsx`
- `frontend/src/pages/auth/GoogleSuccessRegister.jsx`

---

## 8. Check These Files for Reference

All changes have been documented:

1. **Backend Logic**: `controllers/otpControllers.js`
2. **Routes Setup**: `routers/otpRoutes.js`
3. **Validation**: `validators/otpValidationSchema.js`
4. **Database**: `prisma/schema.prisma` (User model)
5. **Frontend Registration**: `frontend/src/pages/auth/Register.jsx`
6. **Frontend Login**: `frontend/src/pages/auth/Login.jsx`

---

## 9. Deployment Checklist

When deploying to production:

- [ ] Update `.env` with production Gmail credentials
- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Run database migrations on production: `npx prisma db push`
- [ ] Test OTP email sending works with production SMTP
- [ ] Test full registration and login flow
- [ ] Monitor server logs for any OTP errors

---

## 10. Troubleshooting

### Issue: "Cannot find module 'nodemailer'"
**Solution**: Run `npm install nodemailer`

### Issue: "Email not sending"
**Solution**:
- Verify Gmail app password is correct
- Enable "Less secure app access" if using regular password
- Check server logs for specific error
- Verify USER_EMAIL in .env matches Gmail account

### Issue: "OTP expired"
**Solution**: OTP valid for 5 minutes. User needs to request new OTP if expired.

### Issue: "Token already exists error"
**Solution**: Clear browser cookies for the domain and try again.

---

## Summary

✅ **What's Done**:
- AppWrite completely removed
- Custom OTP system implemented
- Email sending configured
- Authentication routes updated
- Database migrated
- Frontend updated for new flow
- Token validity increased to 12 hours
- Auto-logout on expiration

⏳ **What You Need to Do**:
1. Install `nodemailer` package
2. Set up Gmail app password
3. Update `.env` with email credentials
4. Test the flows

That's it! 🚀

