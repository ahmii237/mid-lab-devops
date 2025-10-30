from django.test import TestCase
from django.contrib.auth.models import User


class UserAuthenticationTest(TestCase):
    """User Authentication tests"""
    
    def setUp(self):
        """Create Test User"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_user_creation(self):
        """User created successfully"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('testpass123'))
    
    def test_user_count(self):
        """User is saved in database"""
        count = User.objects.count()
        self.assertEqual(count, 1)
    
    def test_user_password_hashed(self):
        """Password should be encrypted (not plain text)"""
        self.assertNotEqual(self.user.password, 'testpass123')
    
    def test_multiple_users(self):
        """Multiple users can be created"""
        user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpass456'
        )
        count = User.objects.count()
        self.assertEqual(count, 2)
        self.assertNotEqual(self.user.id, user2.id)
    
    def test_user_get_by_username(self):
        """Fetch user by username"""
        user = User.objects.get(username='testuser')
        self.assertEqual(user.email, 'test@example.com')


class UserValidationTest(TestCase):
    """User validation tests"""

    def test_username_required(self):
        """Username should be required"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                username='',
                password='pass123'
            )
    
    def test_invalid_password(self):
        """Check password validation"""
        user = User.objects.create_user(
            username='validuser',
            password='correctpass'
        )
        # Galat password
        self.assertFalse(user.check_password('wrongpass'))
        # Sahi password
        self.assertTrue(user.check_password('correctpass'))
