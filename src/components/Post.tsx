import { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 戻るアイコンのインポート
import SendIcon from '@mui/icons-material/Send'; // 投稿アイコンのインポート

interface PostProps {
  onClose: () => void;
  handleUpdatePage: () => void;
}


const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000,
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px', // ボタンの角を丸くする
  padding: '10px 20px', // パディングを設定
  fontSize: '16px', // フォントサイズを調整
  textTransform: 'none', // ボタンのテキストを小文字のままにする
  transition: 'all 0.3s ease', // ホバー時のアニメーション効果
  '&:hover': {
    transform: 'scale(1.05)', // ホバー時にボタンを拡大する
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // ホバー時の影
  },
}));


const App: React.FC<PostProps> = ({ onClose, handleUpdatePage }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPost, setnewPost] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);


  const user_tag = searchParams.get("name");
  if (!user_tag) {
    navigate("/login");
  }

  const handleNavigateToTimeline = () => {
    navigate(`/timeline/?name=${user_tag}`)
  }

  // ボックス外をクリックした場合に閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);




  // 投稿する
  const handlePost = () => {
    const data = {
      message: newPost,
    };
    api.post(`/api/posts/${user_tag}`, data)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          alert('投稿しました。');
          onClose();
          handleUpdatePage();
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("投稿に失敗しました。もう一度お試しください。");
      });
  };



  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >

      <Box  
        ref={boxRef}
        sx={{
          padding: { xs: 2, sm: 5 },
          maxWidth: '450px',
          width: '100%',
          height: 'auto',
          boxShadow: '0px 0px 15px rgba(255, 255, 255, 0.4)',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          overflow: 'auto',
        }}>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: '1.5rem', sm: '1.5rem' } }}
          >
            投稿する
          </Typography>
        </Stack>

        <StyledTextField
          multiline
          rows={6}
          variant="outlined"
          placeholder="いまどうしてる？"
          value={newPost}
          onChange={(e) => setnewPost(e.target.value)}
          sx={{ width: '100%' }}
        />

        <Box display="flex" justifyContent="space-between">
          <StyledButton
            variant="outlined"
            startIcon={<ArrowBackIcon />} // 戻るボタンにアイコンを追加
            onClick={onClose}
            sx={{
              color: '#673ab7',
              borderColor: '#673ab7',
              outline: 'none', // フォーカス時の黒い枠を防ぐ
              boxShadow: 'none', // フォーカス時の影を消す
              '&:focus': {
                outline: 'none', // フォーカス時も黒い枠を防ぐ
                boxShadow: 'none', // フォーカス時の影を消す
                transform: 'none', // フォーカス時の拡大を防ぐ
              },
              '&:hover': {
                boxShadow: 'none', // ホバー時の影を無効化
                transform: 'none', // ホバー時の拡大を防ぐ
              },
            }}
          >
            戻る
          </StyledButton>
        
          <StyledButton
            variant="contained"
            endIcon={<SendIcon />} // 投稿ボタンにアイコンを追加
            onClick={handlePost}
            disabled={!newPost}
            sx={{
              background: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)',
              color: 'white',
              outline: 'none', // フォーカス時の黒い枠を防ぐ
              boxShadow: 'none', // フォーカス時の影を消す
              '&:focus': {
                outline: 'none', // フォーカス時も黒い枠を防ぐ
                boxShadow: 'none', // フォーカス時の影を消す
                transform: 'none', // フォーカス時の拡大を防ぐ
              },
              '&:hover': {
                transform: 'none', // ホバー時の拡大を防ぐ
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)', // 無効時の背景色をグラデーションのまま薄くする
                color: 'rgba(255, 255, 255, 0.5)', // 無効時のテキスト色を薄くする
                opacity: 0.6, // 全体の透明度を設定
              },
            }}
          >
            投稿
          </StyledButton>      
        </Box>
      </Box>
    </Box>
    
  )
}

export default App;
