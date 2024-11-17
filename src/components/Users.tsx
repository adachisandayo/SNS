import { useEffect, useState } from 'react';
import axios from "axios";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  TextField, 
  List, 
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";import { useNavigate, useSearchParams } from 'react-router-dom';
import { Posts, User } from "../types/index";
import TimelineElement from "./TimelineElement"; // コンポーネントのインポート
import Post from "./Post"; // Postコンポーネントをインポート



const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
});


function App() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [follows, setFollows]= useState("");
  const [isFollow, setIsFollow]= useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // 投稿画面のポップアウト用
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ユーザ名を取得
  const src_tag = searchParams.get("name");
  const dst_tag = searchParams.get("user");

  // 投稿ページへ遷移
  const handleNavigateToPost = () => {
    navigate(`/post/?name=${src_tag}`);
  }

  // タイムラインへ遷移
  const handleNavigateToTimeline = () => {
    navigate(`/timeline/?name=${src_tag}`);
  }

  // ユーザをフォローするときに呼び出す関数
  const handleFollow = () => {
    if (!isFollow) {
      api.post(`/api/follows/${src_tag}/${dst_tag}`)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          setFollows("フォロー中");
          setIsFollow(true);
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("フォローに失敗しました。もう一度お試しください。");
      });
    } else{
      api.delete(`/api/follows/${src_tag}/${dst_tag}`)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          setFollows("フォロー")
          setIsFollow(false)
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("フォロー解除に失敗しました。もう一度お試しください。");
      });
    }
  };  

  useEffect(() => {
    if (!src_tag || !dst_tag) {
      navigate("/");
    } else {
      fetchPosts();
    }
  },[src_tag, dst_tag, navigate, reloadCount]);


  // 投稿を取得
  const fetchPosts = async () => {
    try {
      const response = await api.get<{posts: Posts[]; follow: boolean}>(`/api/posts/${src_tag}/${dst_tag}`);
      const {posts, follow} = response.data
      // response.dataの"id"を基準に重複を排除
      const uniquePosts = posts.reduce<Posts[]>((acc, current) => {
        if (!acc.some((post) => post.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      // uniquePostsにuser_tag: dst_tagを追加
      const updatedPosts: Posts[] = uniquePosts.map((post) => ({
        ...post,
        user_tag: dst_tag ?? "", // nullの場合に空文字列を設定(エラー回避)
      }));

      setPosts(updatedPosts);
      if (follow) {
        setFollows("フォロー中");
      } else {
        setFollows("フォロー");
      }
      setIsFollow(follow);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  // ページ更新時の処理
  const handleUpdatePage = () => {
    //window.location.reload();
    setReloadCount(reloadCount + 1);
  };

  //リアクションがクリックされたときの処理
  const handleLike = (post: Posts) => {
    console.log(post)
    if (!post.user_reacted){
      api.post(`/api/reactions/${src_tag}/${post.id}`)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          // `user_reacted` を True に更新
          setPosts((prevPosts) =>
            prevPosts.map((p) =>
              p.id === post.id 
                ? { 
                  ...p, 
                  reaction_count: post.reaction_count+1, 
                  user_reacted: true 
                } : p
            )
          );
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    } else {
      api.delete(`/api/reactions/${src_tag}/${post.id}`)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          // `user_reacted` を False に更新
          setPosts((prevPosts) =>
            prevPosts.map((p) =>
              p.id === post.id 
                ? { 
                  ...p, 
                  reaction_count: post.reaction_count-1, 
                  user_reacted: false 
                } : p
            )
          );            
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
  };

  return (
    <>
      <Box
        mb={2}
        sx={{
          display: 'flex', // Flexboxを有効化
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          flexDirection: { xs: 'column', sm: 'row' }, // 小さい画面では縦、大きい画面では横
          alignItems: 'center', // コンテンツの垂直方向の揃え
          justifyContent: { xs: 'center', sm: 'space-between' }, // 縦並び時は中央寄せ、横並び時はスペースを空ける
          gap: 2, // コンテンツ間の余白
          padding: 2, // 全体の余白
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 柔らかい影
          borderRadius: '0 0 5px 5px', // 上の角を丸くしない
        }}
      >    
        <Typography
          sx={{
            fontSize: 30, 
            fontFamily: 'inherit',
            fontWeight: 550,
            width: '70%',
            height: '100%',
            color: '#9966FF' ,
            textAlign: 'center'
           }}
        >
          {dst_tag}のマイページ
        </Typography>

        {/* フォローボタン */}
        {src_tag !== dst_tag && (
        <Button
            // variant="contained"
            onClick={handleFollow}
            sx={{
              background: isFollow
              ? '#9966FF'
              : 'tramsparent' ,
              color: isFollow ? '#FFFFFF' : '#9966FF', 
              fontWeight: 'bold',
              borderRadius: '24px',
              padding: '10px 24px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #9966FF', 
              outline: 'none', // 黒い枠を防ぐ
              '&:focus': {
                outline: 'none', // フォーカス時も黒い枠を防ぐ
              },
              '&:hover': {
                background: isFollow
                ? '#9966FF'
                : 'tramsparent',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            {follows}
        </Button>        
      )}
      </Box>     

      

      {/* タイムライン */}
      {posts.map((post) => (
        <TimelineElement
          key={post.id}
          post={post}
          onLike={handleLike}
        />
      ))}


      {/* 投稿ボタン(右下に固定) */}
      <Box
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
      >      
        <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #48A9FE 100%)',
              color: '#FFFFFF',
              fontWeight: 'bold',
              borderRadius: '24px',
              padding: '10px 24px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              outline: 'none', // 黒い枠を防ぐ
              '&:focus': {
                outline: 'none', // フォーカス時も黒い枠を防ぐ
              },
              '&:hover': {
                background: 'linear-gradient(135deg, #5A55E0 0%, #3C99DC 100%)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            投稿する
        </Button>
      </Box>  

      <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          fullScreen
          PaperProps={{
            sx: { backgroundColor: 'transparent', margin: 0, boxShadow: 'none' },
          }}
        >
          <DialogContent
            sx={{ padding: '2%' }} // パディングを無くすための設定
          >
            <Post onClose={handleClose} handleUpdatePage={handleUpdatePage} />
          </DialogContent>
        </Dialog>

      
      {/* マイページに遷移するボタン */}
      <Box
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
        >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleNavigateToTimeline}
          sx={{
            backgroundColor: '#FF4081',
            color: '#FFFFFF',
            fontWeight: 'bold',
            borderRadius: '24px',
            padding: '10px 24px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            outline: 'none', // 黒い枠を防ぐ
            '&:focus': {
              outline: 'none', // フォーカス時も黒い枠を防ぐ
            },
            '&:hover': {
              backgroundColor: '#F50057',
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          タイムライン
        </Button>        
      </Box>


      {/* 更新ボタン */}
      <Box
        style={{
          position: "fixed",
          bottom: 70,
          left: 16,
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
        >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpdatePage}
          sx={{
            backgroundColor: '#FF4081',
            color: '#FFFFFF',
            fontWeight: 'bold',
            borderRadius: '24px',
            padding: '10px 24px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            outline: 'none', // 黒い枠を防ぐ
            '&:focus': {
              outline: 'none', // フォーカス時も黒い枠を防ぐ
            },
            '&:hover': {
              backgroundColor: '#F50057',
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          更新
        </Button>        
      </Box>

      <Box  
        sx={{
          width: '100%',
          height: '70px',
          backgroundColor: 'transparent',
        }}>
      </Box>
    </>
  )
}

export default App;
