from sqlalchemy import (
    Column, Integer, String, Text, DECIMAL, SmallInteger, Boolean,
    ForeignKey, TIMESTAMP, CheckConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    province = Column(String(100), nullable=False)

    places = relationship("Place", back_populates="city")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)

    places = relationship("Place", back_populates="category")


class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    latitude = Column(DECIMAL(9, 6))
    longitude = Column(DECIMAL(9, 6))
    address = Column(Text)
    phone = Column(String(20))
    opening_hours = Column(Text)
    website = Column(Text)
    instagram = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now())

    # فیلدهای مدیریت کیفیت دیتا
    is_active = Column(Boolean, nullable=False, default=True)
    review_status = Column(String(20), nullable=False, default="osm_imported")
    # مقادیر ممکن: 'osm_imported', 'needs_review', 'reviewed'

    city = relationship("City", back_populates="places")
    category = relationship("Category", back_populates="places")
    place_features = relationship("PlaceFeature", back_populates="place", cascade="all, delete")


class PlaceFeature(Base):
    __tablename__ = "place_features"

    place_id = Column(Integer, ForeignKey("places.id", ondelete="CASCADE"), primary_key=True)
    feature_id = Column(Integer, ForeignKey("features.id", ondelete="CASCADE"), primary_key=True)
    value = Column(SmallInteger, nullable=False)

    __table_args__ = (
        CheckConstraint("value BETWEEN 0 AND 10", name="value_range_check"),
    )

    place = relationship("Place", back_populates="place_features")
    feature = relationship("Feature")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(Text, nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    favorites = relationship("UserFavorite", back_populates="user", cascade="all, delete")


class UserFavorite(Base):
    __tablename__ = "user_favorites"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(Integer, ForeignKey("places.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="favorites")
    place = relationship("Place")
