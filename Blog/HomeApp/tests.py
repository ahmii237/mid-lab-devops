from django.test import TestCase
from django.contrib.auth.models import User
from .models import Post


class PostModelTest(TestCase):
    """Blog Post Model tests"""
    
    def setUp(self):
        """Create dummy data for tests"""
        # Create User
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_post_creation(self):
        """New post creation test"""
        post = Post.objects.create(
            title='Test Post',
            content='This is test content',
            author=self.user
        )
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(post.author, self.user)
        self.assertEqual(str(post), 'Test Post')
    
    def test_post_content_not_empty(self):
        """Content is required for Post"""
        post = Post.objects.create(
            title='Another Post',
            content='Some content here',
            author=self.user
        )
        self.assertNotEqual(post.content, '')
        self.assertTrue(len(post.content) > 0)
    
    def test_post_has_timestamp(self):
        """Post has created_at and updated_at timestamps"""
        post = Post.objects.create(
            title='Timestamp Test',
            content='Testing timestamps',
            author=self.user
        )
        self.assertIsNotNone(post.created_at)
        self.assertIsNotNone(post.updated_at)
    
    def test_post_ordering(self):
        """New posts should come first"""
        post1 = Post.objects.create(
            title='Old Post',
            content='Content 1',
            author=self.user
        )
        post2 = Post.objects.create(
            title='New Post',
            content='Content 2',
            author=self.user
        )
        posts = Post.objects.all()
        self.assertEqual(posts[0], post2)
        self.assertEqual(posts[1], post1)


class PostAPITest(TestCase):
    """Post API basic tests"""
    
    def setUp(self):
        """Setup"""
        self.user = User.objects.create_user(
            username='apiuser',
            password='apipass123'
        )
        self.post = Post.objects.create(
            title='API Test Post',
            content='API testing content',
            author=self.user
        )
    
    def test_post_count(self):
        """Check total post count"""
        count = Post.objects.count()
        self.assertEqual(count, 1)
    
    def test_post_by_author(self):
        """Fetch posts by author"""
        posts = Post.objects.filter(author=self.user)
        self.assertEqual(posts.count(), 1)
        self.assertEqual(posts[0].title, 'API Test Post')
