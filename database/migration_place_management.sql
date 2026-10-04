-- ==========================================
-- Migration: Place Management (is_active + review_status)
-- این اسکریپت چیزی رو DROP نمی‌کنه، فقط دو ستون جدید اضافه می‌کنه
-- ==========================================

ALTER TABLE places
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE places
    ADD COLUMN IF NOT EXISTS review_status VARCHAR(20) NOT NULL DEFAULT 'osm_imported';

-- مکان‌هایی که خودت اول پروژه دستی وارد کردی، فرض می‌کنیم از قبل بررسی‌شده‌ان
-- (بقیه، چه قبلی چه بعدی، پیش‌فرض 'osm_imported' می‌گیرن مگه اینکه دستی بررسی/ویرایش بشن)
UPDATE places
SET review_status = 'reviewed'
WHERE id <= 21;
