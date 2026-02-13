import { useEffect, useState } from 'react';
import agent from '../api/agent';
import { type Post } from '../types/models';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, CardMedia, Button, CardActions, Box, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        agent.Posts.list()
            .then(gelenPostlar => setPosts(gelenPostlar))
            .catch(error => console.error("Hata var:", error));
    }, []);

    return (
        <>
            {/* HERO SELECTİON */}
            <Box sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #e91e63 100%)',
                color: 'white',
                py: 8,
                mb: 6,
                borderRadius: 4,
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
                <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                    Selam
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                    Ben yaptım
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h2" fontWeight="bold">
                        Son Yazılar
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Toplam {posts.length} yazı
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {posts.map((post) => (
                        <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="div"
                                    sx={{
                                        pt: '56.25%', // 16:9 aspect ratio
                                    }}
                                    image={post.featuredImageUrl || "https://source.unsplash.com/random?technology"}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Chip
                                            label={post.categoryName}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                    <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="medium">
                                            ✍️ {post.authorName}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        size="medium"
                                        component={Link}
                                        to={`/post/${post.id}`}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ ml: 'auto' }}
                                    >
                                        Devamını Oku
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}
