import IconButton from '@mui/material/IconButton/IconButton';
import TextField from '@mui/material/TextField/TextField';
import React, { ChangeEvent, FC, KeyboardEvent, memo, useState } from 'react';
import { AddBox } from "@mui/icons-material";

type Props = {
    addItem: (title: string) => void
}

export const AddItemForm: FC<Props> = memo(({ addItem }) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItemCallback = () => {
        if (title.trim() !== "") {
            addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.charCode === 13) {
            addItemCallback();
        }
    }

    return <div>
        <TextField variant="outlined"
            error={!!error}
            value={title}
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
            label="Title"
            helperText={error}
        />
        <IconButton color="primary" onClick={addItemCallback}>
            <AddBox />
        </IconButton>
    </div>
})
