import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  useEditableControls,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton
        aria-label="Save"
        icon={<Icon icon="fa6-solid:check" />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        variant="outline"
        aria-label="Cancel"
        icon={<Icon icon="fa6-solid:xmark" />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton
        variant="outline"
        aria-label="edit"
        size="sm"
        icon={<Icon icon="fa6-solid:pen-to-square" />}
        {...getEditButtonProps()}
      />
    </Flex>
  )
}

interface Props {
  defaultValue?: string
  onSubmit: (value: string) => void // eslint-disable-line no-unused-vars
}

function EditableText({ defaultValue, onSubmit }: Props) {
  return (
    <Editable
      defaultValue={defaultValue}
      isPreviewFocusable={false}
      submitOnBlur={false}
      onSubmit={onSubmit}
    >
      <EditablePreview />
      <Input as={EditableInput} />
      <EditableControls />
    </Editable>
  )
}
export default EditableText
