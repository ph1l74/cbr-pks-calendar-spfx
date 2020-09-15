
import { Component } from 'react';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import * as React from 'react';
import { stateToHTML } from 'draft-js-export-html';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import styles from '../components/RcrCalendar.module.scss';
import { message } from 'antd';
import * as $ from 'jquery';
interface IRichEditorState {
    editorState: any;
}
interface IRichEditorProps {
    maxLength: number;
    height?: number;
    // minRows?: number;
    // maxRows?: number;
    defaultValue: string;
    onChange: (value: string) => void;
}
const options = {
    defaultBlockTag: 'div',

  };

class RichEditor extends Component<IRichEditorProps, IRichEditorState> {
    constructor(props) {
        super(props);
        // this.state = {
        //     editorState: EditorState.createEmpty()
        // };

        // this.state = {
        //   editorState: EditorState.createWithContent(
        //     ContentState.createFromBlockArray(
        //       convertFromHTML(this.props.defaultValue)
        //     )
        //   ),
        // };

        const blocksFromHtml = htmlToDraft(this.props.defaultValue);
        // const blocksFromHTML = convertFromHTML(this.props.defaultValue);
        const content = ContentState.createFromBlockArray(
            blocksFromHtml.contentBlocks,
            blocksFromHtml.entityMap
        );
        this.state = { editorState: EditorState.createWithContent(content) };

    }
    public onEditorStateChange = editorState => {
        // console.log('editorState', editorState);
        // let finalText = '';
        // let text = editorState.getCurrentContent().getBlocksAsArray();
        // text.map((item) => { finalText = item.getText() + finalText });
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const blocks = rawContentState.blocks;
        const hashtagConfig = {
            trigger: '#',
            separator: ' ',
          };
        const markup = draftToHtml(
            rawContentState,
            hashtagConfig,
            // directional,
            // customEntityTransform
          );
        // const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        // const value2 = editorState.getCurrentContent().getPlainText('\u0001');
        // console.log(finalText, value, value2, stateToHTML(editorState.getCurrentContent()));
        // console.log(markup, stateToHTML(editorState.getCurrentContent(), options), blocks);
        if (markup.length > this.props.maxLength){
            message.warning(`Длина контента не может превышать ${this.props.maxLength} символов!`);
            return;
        }
        this.setState({ editorState });
        this.props.onChange(markup);
    }
    public render() {
        const { editorState } = this.state;
        if (this.props.height){
            $('.rdw-editor-main').css('max-height', this.props.height); // Todo Лучше в свойстве Editor
            // styleEditor = {maxHeight: this.props.height};
        }
        return (
            <div className={styles.richEditorRoot}>
                <Editor
                    editorState={editorState}
                    wrapperClassName="rich-editor demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    placeholder="Введите текст..." />
            </div>
        );
    }
}
export { RichEditor };

// const editorState = EditorState.createEmpty();
// const editorStateWithoutUndo = EditorState.set(editorState, {
//   allowUndo: false,
// });
// export const RichEditor = () => {
//     return (
//         <div>
//             <Editor
//                 editorState={editorState}
//                 wrapperClassName="rich-editor demo-wrapper"
//                 editorClassName="demo-editor"
//                 onEditorStateChange={this.onEditorStateChange}
//                 placeholder="The message goes here..." />
//         </div>
//     );
// }