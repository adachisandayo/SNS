import { useEffect, useState, useCallback } from 'react';
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
} from "@mui/material";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Posts, User } from "../types/index";
import TimelineElement from "./TimelineElement"; // コンポーネントのインポート
import Post from "./Post"; // Postコンポーネントをインポート



const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
});


function App() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [reloadCount, setReloadCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 投稿画面のポップアウト用
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ユーザ名を取得
  const user_tag = searchParams.get("name");

  // 投稿ページへ遷移
  const handleNavigateToPost = () => {
    navigate(`/post/?name=${user_tag}`);
  };

  // ユーザページへ遷移
  const handleNavigateToUser = (userid: string | null) => {
    navigate(`/users/?name=${user_tag}&user=${userid}`);
  };


  // ユーザ検索APIの呼び出し
  const fetchFilteredUsers = useCallback( async (value: string) => {
    try {
      const response = await api.get(`/api/search/${value}`);
      setFilteredUsers(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);


  //ユーザ検索ボックスの入力監視用
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredUsers(searchTerm);
    }, 500); //0.5秒後にAPI呼び出し

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchFilteredUsers]);


  // タイムラインを取得
  const fetchPosts = () => {
    api.get<Posts[]>(`/api/timeline/${user_tag}`)
    .then((response) => {
      // response.dataの"id"を基準に重複を排除
      const uniquePosts = response.data.reduce<Posts[]>((acc, current) => {
        if (!acc.some((post) => post.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setPosts(uniquePosts);
      console.log(uniquePosts);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
  };

  useEffect(() => {
    if (!user_tag) {
      navigate("/");
    } else {
      fetchPosts();
    }
  }, [user_tag, navigate, reloadCount]);


  // ページ更新時の処理
  const handleUpdatePage = () => {
    //window.location.reload();
    setReloadCount(reloadCount + 1);
  };

  //リアクションがクリックされたときの処理
  const handleLike = () => {
    console.log("いいね！");
  };

  return (
    <>
      {/* <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='ユーザを検索'
      />


      {filteredUsers.map((user) => (
        <div key={user.id}>
          <div onClick={() => handleNavigateToUser(user.user_tag)}>{user.user_tag}</div>
        </div>
      ))} */}

      <Box sx={{ mb: 2, position: 'relative' }}>
          <TextField
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ユーザを検索"
            fullWidth
            sx={{
              // position: 'absolute',
              zIndex: 1,
              width: '50%',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: 0,
            }}
          />
          {filteredUsers.length > 0 && (
            <List
              sx={{
                position: 'absolute',
                zIndex: 1,
                width: '50%',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: 0,
              }}
            >
              {filteredUsers.map((user) => (
                <ListItem
                  key={user.id}
                  disablePadding
                  sx={{ border: '1px solid #ccc', marginBottom: '0px', borderRadius: '2px' }}
                >
                  <ListItemButton onClick={() => handleNavigateToUser(user.user_tag)}>
                    <ListItemText primary={user.user_tag} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

      
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
          onClick={() => handleNavigateToUser(user_tag)}
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
          マイページ
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
      <button onClick={() => handleNavigateToUser(user_tag)}>マイページ</button>
    </>

  );
}

export default App;
