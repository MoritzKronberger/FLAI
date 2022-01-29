import { Ref } from 'vue'

export const profileValidation = (
  result: { status: number; data: any },
  errorMessages: Ref<string[]>,
  validation: { username: boolean; password: boolean; email: boolean },
  successCallback: () => void
) => {
  errorMessages.value = []
  if (result.status === 200) {
    successCallback()
  } else {
    type ValidationKey = keyof typeof validation

    for (const el in validation) {
      validation[el as ValidationKey] = false
    }

    console.log(errorMessages)

    for (const el in result.data) {
      console.log(result.data[el].message)
      errorMessages.value.push(result.data[el].message)
      validation[result.data[el].path[0] as ValidationKey] = true
    }
  }
}
