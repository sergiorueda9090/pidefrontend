import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  Code,
  Title,
  FormatQuote,
} from '@mui/icons-material';

const RichTextEditor = ({ value, onChange, placeholder, minHeight = '250px' }) => {
  const editorRef = useRef(null);
  const [formats, setFormats] = useState([]);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleToggleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  const insertList = (type) => {
    handleFormat(type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList');
  };

  const insertLink = () => {
    const url = prompt('Ingresa la URL:');
    if (url) {
      handleFormat('createLink', url);
    }
  };

  const handleInput = (e) => {
    const html = e.currentTarget.innerHTML;
    onChange(html);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          backgroundColor: 'grey.100',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
        }}
      >
        {/* Formato de texto */}
        <ToggleButtonGroup
          value={formats}
          onChange={handleToggleFormat}
          size="small"
          aria-label="text formatting"
        >
          <ToggleButton value="bold" onClick={() => handleFormat('bold')}>
            <Tooltip title="Negrita (Ctrl+B)">
              <FormatBold fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="italic" onClick={() => handleFormat('italic')}>
            <Tooltip title="Cursiva (Ctrl+I)">
              <FormatItalic fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="underline" onClick={() => handleFormat('underline')}>
            <Tooltip title="Subrayado (Ctrl+U)">
              <FormatUnderlined fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Encabezados */}
        <ToggleButtonGroup size="small" exclusive>
          <ToggleButton value="h1" onClick={() => handleFormat('formatBlock', '<h1>')}>
            <Tooltip title="Título 1">
              <Typography variant="caption" fontWeight={700}>H1</Typography>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="h2" onClick={() => handleFormat('formatBlock', '<h2>')}>
            <Tooltip title="Título 2">
              <Typography variant="caption" fontWeight={700}>H2</Typography>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="h3" onClick={() => handleFormat('formatBlock', '<h3>')}>
            <Tooltip title="Título 3">
              <Typography variant="caption" fontWeight={700}>H3</Typography>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Listas */}
        <IconButton size="small" onClick={() => insertList('bullet')}>
          <Tooltip title="Lista con viñetas">
            <FormatListBulleted fontSize="small" />
          </Tooltip>
        </IconButton>
        <IconButton size="small" onClick={() => insertList('numbered')}>
          <Tooltip title="Lista numerada">
            <FormatListNumbered fontSize="small" />
          </Tooltip>
        </IconButton>

        <Divider orientation="vertical" flexItem />

        {/* Enlaces y otros */}
        <IconButton size="small" onClick={insertLink}>
          <Tooltip title="Insertar enlace">
            <LinkIcon fontSize="small" />
          </Tooltip>
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('formatBlock', '<blockquote>')}>
          <Tooltip title="Cita">
            <FormatQuote fontSize="small" />
          </Tooltip>
        </IconButton>
      </Box>

      {/* Editor área */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        sx={{
          minHeight,
          maxHeight: '400px',
          overflowY: 'auto',
          p: 2,
          backgroundColor: 'white',
          outline: 'none',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          '&:empty:before': {
            content: `"${placeholder || 'Escribe aquí...'}"`,
            color: 'text.disabled',
          },
          '& h1': {
            fontSize: '2rem',
            fontWeight: 700,
            margin: '0.5em 0',
          },
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: '0.5em 0',
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: '0.5em 0',
          },
          '& p': {
            margin: '0.5em 0',
          },
          '& ul, & ol': {
            paddingLeft: '2em',
            margin: '0.5em 0',
          },
          '& li': {
            margin: '0.25em 0',
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'underline',
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            paddingLeft: '1em',
            margin: '0.5em 0',
            fontStyle: 'italic',
            color: 'text.secondary',
          },
          '& code': {
            backgroundColor: 'grey.100',
            padding: '0.2em 0.4em',
            borderRadius: '3px',
            fontSize: '0.9em',
            fontFamily: 'monospace',
          },
        }}
      />
    </Paper>
  );
};

export default RichTextEditor;
